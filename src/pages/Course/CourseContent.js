
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaHeadphones, FaFilePdf, FaPlay, FaPause, FaChevronDown, FaChevronRight, FaCheckCircle, FaTimesCircle, FaLock, FaStepForward, FaStepBackward, FaForward, FaBackward } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { BsGraphUp, BsCheck2All } from "react-icons/bs";

export default function CourseContent() {
  const { id } = useParams();
  const [chapters, setChapters] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [examAnswers, setExamAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userProgress, setUserProgress] = useState({
    completedLessons: [],
    attemptedExam: false,
    examScore: null
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [showPlaybackOptions, setShowPlaybackOptions] = useState(false);
  
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // Load user progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(`courseProgress_${id}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    
    // Load volume preference
    const savedVolume = localStorage.getItem('audioVolume');
    if (savedVolume) {
      setVolume(parseInt(savedVolume));
    }
  }, [id]);

  // Save user progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`courseProgress_${id}`, JSON.stringify(userProgress));
  }, [id, userProgress]);

  // Save volume preference
  useEffect(() => {
    localStorage.setItem('audioVolume', volume.toString());
  }, [volume]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://learnly-backend-05ix.onrender.com/courses/${id}/content`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (!response.ok) throw new Error("Failed to fetch content");
        
        const data = await response.json();
        if (data.success) {
          setChapters(data.data);
          const answers = {};
          data.data.forEach((chapter, cIdx) => {
            if (chapter.exam) {
              chapter.exam.examQuestions.forEach((_, qIdx) => {
                answers[`${cIdx}-${qIdx}`] = "";
              });
            }
          });
          setExamAnswers(answers);
          
          if (data.data.length > 0) {
            setExpandedChapters({ [0]: true });
            // Auto-select first lesson if none selected
            if (!selectedLesson) {
              setSelectedLesson({ chapter: 0, lesson: 0 });
            }
          }
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle audio ended event
  const handleAudioEnded = (chapterIndex, lessonIndex) => {
    const lesson = chapters[chapterIndex]?.lessons[lessonIndex];
    if (!lesson) return;
    
    // Check if this was the last audio in the lesson
    if (lesson.audioFile && currentAudioIndex === lesson.audioFile.length - 1) {
      // Mark lesson as complete
      markLessonComplete(chapterIndex, lessonIndex);
      
      // Automatically unlock and select next lesson
      unlockNextLesson(chapterIndex, lessonIndex);
    } else {
      // Play next audio in the same lesson
      setCurrentAudioIndex(prev => prev + 1);
    }
  };

  // Unlock and select the next lesson
  const unlockNextLesson = (chapterIndex, lessonIndex) => {
    const chapter = chapters[chapterIndex];
    const nextLessonIndex = lessonIndex + 1;
    
    // Check if there's another lesson in the same chapter
    if (nextLessonIndex < chapter.lessons.length) {
      setSelectedLesson({ chapter: chapterIndex, lesson: nextLessonIndex });
      return;
    }
    
    // Check if there's another chapter
    if (chapterIndex < chapters.length - 1) {
      const nextChapter = chapters[chapterIndex + 1];
      if (nextChapter.lessons.length > 0) {
        setSelectedLesson({ chapter: chapterIndex + 1, lesson: 0 });
        // Expand next chapter in sidebar
        setExpandedChapters(prev => ({ ...prev, [chapterIndex + 1]: true }));
      }
    }
  };

  const toggleChapter = (index) => {
    setExpandedChapters(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleAnswerSelect = (questionKey, answer) => {
    setExamAnswers(prev => ({
      ...prev,
      [questionKey]: answer
    }));
  };

  const submitExam = async () => {
    if (!selectedLesson || selectedLesson.type !== 'exam') return;
    
    const chapter = chapters[selectedLesson.chapter];
    const exam = chapter.exam;
    
    const unansweredQuestions = exam.examQuestions.filter((_, i) => {
      const key = `${selectedLesson.chapter}-${i}`;
      return !examAnswers[key];
    });

    if (unansweredQuestions.length > 0) {
      setSubmissionStatus({
        status: "error",
        message: `Please answer all questions. ${unansweredQuestions.length} unanswered.`
      });
      return;
    }

    const answers = exam.examQuestions.map((q, index) => {
      const questionKey = `${selectedLesson.chapter}-${index}`;
      return {
        question: q.question,
        selectedAnswer: examAnswers[questionKey] || ""
      };
    });

    try {
      setSubmissionStatus({ status: "submitting", message: "Submitting exam..." });
      
      const token = localStorage.getItem("token");
      const response = await fetch("https://learnly-backend-05ix.onrender.com/user/exam/answer-submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          examId: exam.examId,
          courseId: id,
          chapterTitle: chapter.title,
          answers
        })
      });

      const data = await response.json();
      if (data.success) {
        setUserProgress(prev => ({
          ...prev,
          attemptedExam: true,
          examScore: data.data
        }));
        setSubmissionStatus({ 
          status: "success", 
          message: "Exam submitted successfully!",
          data: data.data
        });
      } else {
        throw new Error(data.message || "Exam submission failed");
      }
    } catch (error) {
      setSubmissionStatus({ 
        status: "error", 
        message: error.message || "Failed to submit exam" 
      });
    }
  };

  const handleAudioPlay = (audioUrl, audioName, chapterIndex, lessonIndex, audioIndex) => {
    // If playing the same audio, just toggle play/pause
    if (audioRef.current && audioRef.current.src === audioUrl && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    
    // New audio to play
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    audioRef.current = new Audio(audioUrl);
    audioRef.current.volume = volume / 100;
    audioRef.current.playbackRate = playbackRate;
    
    // Set up event listeners
    audioRef.current.addEventListener('loadedmetadata', () => {
      setDuration(audioRef.current.duration);
    });
    
    audioRef.current.addEventListener('timeupdate', () => {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    });
    
    audioRef.current.addEventListener('ended', () => {
      setIsPlaying(false);
      handleAudioEnded(chapterIndex, lessonIndex);
    });
    
    audioRef.current.addEventListener('play', () => {
      setIsPlaying(true);
    });
    
    audioRef.current.addEventListener('pause', () => {
      setIsPlaying(false);
    });
    
    audioRef.current.play();
    setIsPlaying(true);
    
    // Update current audio index
    setCurrentAudioIndex(audioIndex);
  };

  const playPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const skipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
  };

  const skipBackward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
  };

  const skipToNextAudio = () => {
    if (!selectedLesson || selectedLesson.type === 'exam') return;
    
    const chapterIndex = selectedLesson.chapter;
    const lessonIndex = selectedLesson.lesson;
    const lesson = chapters[chapterIndex]?.lessons[lessonIndex];
    
    if (!lesson || !lesson.audioFile) return;
    
    const nextIndex = currentAudioIndex + 1;
    if (nextIndex < lesson.audioFile.length) {
      const nextAudio = lesson.audioFile[nextIndex];
      handleAudioPlay(nextAudio.url, nextAudio.name, chapterIndex, lessonIndex, nextIndex);
    } else {
      // End of lesson, mark as complete
      markLessonComplete(chapterIndex, lessonIndex);
      unlockNextLesson(chapterIndex, lessonIndex);
    }
  };

  const skipToPrevAudio = () => {
    if (!selectedLesson || selectedLesson.type === 'exam') return;
    
    const chapterIndex = selectedLesson.chapter;
    const lessonIndex = selectedLesson.lesson;
    const lesson = chapters[chapterIndex]?.lessons[lessonIndex];
    
    if (!lesson || !lesson.audioFile) return;
    
    const prevIndex = Math.max(currentAudioIndex - 1, 0);
    if (prevIndex !== currentAudioIndex) {
      const prevAudio = lesson.audioFile[prevIndex];
      handleAudioPlay(prevAudio.url, prevAudio.name, chapterIndex, lessonIndex, prevIndex);
    } else {
      // Restart current audio
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    setShowPlaybackOptions(false);
  };

  const markLessonComplete = (chapterIndex, lessonIndex) => {
    const lessonKey = `${chapterIndex}-${lessonIndex}`;
    
    // Check if already completed
    if (userProgress.completedLessons.includes(lessonKey)) {
      return;
    }
    
    setUserProgress(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonKey]
    }));
    
    // Stop audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const isLessonCompleted = (chapterIndex, lessonIndex) => {
    return userProgress.completedLessons.includes(`${chapterIndex}-${lessonIndex}`);
  };

  const isLessonLocked = (chapterIndex, lessonIndex) => {
    // First lesson is always unlocked
    if (chapterIndex === 0 && lessonIndex === 0) {
      return false;
    }
    
    // Check if previous lesson is completed
    if (lessonIndex > 0) {
      return !isLessonCompleted(chapterIndex, lessonIndex - 1);
    }
    
    // For first lesson of subsequent chapters, check last lesson of previous chapter
    if (chapterIndex > 0) {
      const prevChapter = chapters[chapterIndex - 1];
      return !isLessonCompleted(chapterIndex - 1, prevChapter.lessons.length - 1);
    }
    
    return false;
  };

  const isExamAvailable = (chapterIndex) => {
    const chapter = chapters[chapterIndex];
    if (!chapter.exam) return false;
    
    // Check if all lessons in this chapter are completed
    const allLessonsCompleted = chapter.lessons.every((_, lessonIndex) => 
      isLessonCompleted(chapterIndex, lessonIndex)
    );
    
    return allLessonsCompleted;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const renderMediaFiles = (lesson, chapterIndex, lessonIndex) => {
    const currentAudio = lesson.audioFile?.[currentAudioIndex];
    
    return (
      <div className="media-container">
        {lesson.description && (
          <div className="lesson-description">
            <h3 className="description-title">Lesson Overview</h3>
            <p className="description-text">{lesson.description}</p>
          </div>
        )}
        
        {lesson.audioFile?.length > 0 && (
          <div className="audio-section">
            <h4 className="section-title">
              <FaHeadphones className="icon" /> Audio Lectures
            </h4>
            <div className="audio-player">
              <div className="player-header">
                <div className="player-title">
                  <div className="now-playing">Now Playing</div>
                  <div className="audio-name">{currentAudio?.name || "Select audio"}</div>
                </div>
                <div className="audio-meta">
                  <span className="duration">
                    <IoMdTime /> {formatTime(duration)}
                  </span>
                </div>
              </div>
              
              <div className="player-controls">
                <div className="progress-container" ref={progressBarRef} onClick={handleSeek}>
                  <div 
                    className="progress-bar" 
                    style={{ width: `${progress}%` }}
                  ></div>
                  <div 
                    className="progress-thumb" 
                    style={{ left: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="time-info">
                  <div className="current-time">{formatTime(currentTime)}</div>
                  <div className="total-time">{formatTime(duration)}</div>
                </div>
                
                <div className="control-buttons">
                  <button className="control-btn" onClick={skipToPrevAudio}>
                    <FaStepBackward />
                  </button>
                  <button className="control-btn" onClick={skipBackward}>
                    <FaBackward />
                  </button>
                  <button className="play-btn" onClick={playPause}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <button className="control-btn" onClick={skipForward}>
                    <FaForward />
                  </button>
                  <button className="control-btn" onClick={skipToNextAudio}>
                    <FaStepForward />
                  </button>
                  
                  <div className="volume-control">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume}
                      onChange={handleVolumeChange}
                      className="volume-slider"
                    />
                  </div>
                  
                  <div className="playback-rate">
                    <button 
                      className="rate-btn" 
                      onClick={() => setShowPlaybackOptions(!showPlaybackOptions)}
                    >
                      {playbackRate}x
                    </button>
                    {showPlaybackOptions && (
                      <div className="rate-options">
                        {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(rate => (
                          <button
                            key={rate}
                            className={`rate-option ${playbackRate === rate ? 'active' : ''}`}
                            onClick={() => changePlaybackRate(rate)}
                          >
                            {rate}x
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="audio-list">
                {lesson.audioFile.map((audio, i) => (
                  <div 
                    key={i} 
                    className={`audio-item ${currentAudioIndex === i ? 'active' : ''}`}
                    onClick={() => handleAudioPlay(audio.url, audio.name, chapterIndex, lessonIndex, i)}
                  >
                    <div className="audio-info">
                      <div className="audio-name">{audio.name}</div>
                      <div className="audio-meta">
                        <span className="duration">
                          <IoMdTime /> {formatTime(audio.duration || 300)}
                        </span>
                      </div>
                    </div>
                    <div className="play-indicator">
                      {currentAudioIndex === i && isPlaying ? <FaPause /> : <FaPlay />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {lesson.pdfFile?.length > 0 && (
          <div className="pdf-section">
            <h4 className="section-title">
              <FaFilePdf className="icon" /> Study Materials
            </h4>
            <div className="pdf-grid">
              {lesson.pdfFile.map((pdf, i) => (
                <a 
                  key={i} 
                  href={pdf.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="pdf-card"
                >
                  <div className="pdf-icon">
                    <FaFilePdf />
                  </div>
                  <div className="pdf-details">
                    <div className="pdf-name">{pdf.name}</div>
                    <div className="pdf-meta">
                      <span className="pages">{pdf.pages || 12} pages</span>
                    </div>
                  </div>
                  <div className="download-badge">Download</div>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="lesson-actions">
          {!isLessonCompleted(chapterIndex, lessonIndex) && (
            <button 
              className="complete-lesson-button"
              onClick={() => markLessonComplete(chapterIndex, lessonIndex)}
            >
              Mark as Complete
            </button>
          )}

          {isLessonCompleted(chapterIndex, lessonIndex) && (
            <div className="completion-badge">
              <FaCheckCircle /> Lesson Completed
            </div>
          )}
          
          {lesson.audioFile?.length > 1 && (
            <div className="audio-navigation">
              <button 
                className="nav-button prev"
                onClick={skipToPrevAudio}
                disabled={currentAudioIndex === 0}
              >
                Previous Audio
              </button>
              <button 
                className="nav-button next"
                onClick={skipToNextAudio}
                disabled={currentAudioIndex === lesson.audioFile.length - 1}
              >
                Next Audio
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) return (
    <div className="loading-container">
      <div className="spinner"></div>
      <div>Loading course content...</div>
    </div>
  );
  
  if (error) return (
    <div className="error-container">
      <div className="error-icon">!</div>
      <div className="error-message">Error: {error}</div>
      <button className="retry-button" onClick={() => window.location.reload()}>
        Try Again
      </button>
    </div>
  );

  return (
    <div className="course-content-container">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? '×' : '☰'}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          {/* <div className="course-title">Advanced React Development</div>
          <div className="stats">
            <div className="progress-container">
              <div className="progress-bar" style={{ width: '35%' }}></div>
            </div>
            <div className="progress-text">35% Complete</div>
          </div> */}
        </div>

        <div className="chapter-list">
          {chapters.map((chapter, idx) => (
            <div key={idx} className="chapter-item">
              <div 
                className={`chapter-header ${expandedChapters[idx] ? 'expanded' : ''}`}
                onClick={() => toggleChapter(idx)}
              >
                <div className="chevron">
                  {expandedChapters[idx] ? <FaChevronDown /> : <FaChevronRight />}
                </div>
                <div className="chapter-info">
                  <h4>Chapter {idx + 1}: {chapter.title}</h4>
                  <div className="chapter-meta">
                    {chapter.lessons.length} lessons • 45 min
                  </div>
                </div>
                {chapter.exam && (
                  <div className="exam-badge">
                    Exam
                  </div>
                )}
              </div>

              {expandedChapters[idx] && (
                <div className="lesson-list">
                  {chapter.lessons.map((lesson, lidx) => {
                    const isActive = selectedLesson?.chapter === idx && 
                                    selectedLesson?.lesson === lidx;
                    return (
                      <div 
                        key={lidx} 
                        className={`lesson-item ${isActive ? 'active' : ''}
                                      ${isLessonLocked(idx, lidx) ? 'locked' : ''}`}
                        onClick={() => !isLessonLocked(idx, lidx) && setSelectedLesson({ chapter: idx, lesson: lidx })}
                      >
                        <div className="lesson-icon">
                          {isLessonLocked(idx, lidx) ? <FaLock /> : <FaPlay />}
                        </div>
                        <div className="lesson-info">
                          <div className="lesson-name">
                            {lesson.lessonname}
                            {isLessonLocked(idx, lidx) && <span className="lock-indicator"> (Locked)</span>}
                          </div>
                          <div className="lesson-meta">
                            <span className="meta-item">
                              <IoMdTime /> {Math.floor((lesson.audioFile?.length || 0) * 5)} min
                            </span>
                            {isLessonCompleted(idx, lidx) && (
                              <span className="meta-item completed">
                                <FaCheckCircle /> Completed
                              </span>
                            )}
                          </div>
                        </div>
                        {isActive && (
                          <div className="active-indicator"></div>
                        )}
                      </div>
                    );
                  })}

                  {chapter.exam && (
                    <div 
                      className={`exam-item ${selectedLesson?.chapter === idx && 
                                      selectedLesson?.type === 'exam' ? 'active' : ''}
                                    ${!isExamAvailable(idx) || userProgress.attemptedExam ? 'disabled' : ''}`}
                      onClick={() => {
                        if (isExamAvailable(idx) && !userProgress.attemptedExam) {
                          setSelectedLesson({ chapter: idx, type: 'exam' });
                        }
                      }}
                    >
                      <div className="exam-icon">
                        📝
                      </div>
                      <div className="exam-info">
                        <div className="exam-name">
                          {chapter.exam.examinationName}
                          {userProgress.attemptedExam && <span className="attempted-indicator"> (Attempted)</span>}
                          {!isExamAvailable(idx) && !userProgress.attemptedExam && <span className="locked-indicator"> (Complete lessons)</span>}
                        </div>
                        <div className="exam-meta">
                          {chapter.exam.examQuestions.length} questions • 20 min
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        

      </div>

      {/* Main Content */}
      <div className="main-content">
        {selectedLesson ? (
          selectedLesson.type === 'exam' ? (
            <div className="exam-container">
              <div className="exam-header">
                <h2>{chapters[selectedLesson.chapter].exam.examinationName}</h2>
                <div className="exam-stats">
                  <div className="stat-item">
                    <div className="stat-label">Questions</div>
                    <div className="stat-value">
                      {chapters[selectedLesson.chapter].exam.examQuestions.length}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Total Marks</div>
                    <div className="stat-value">
                      {chapters[selectedLesson.chapter].exam.totalMarks}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Subject</div>
                    <div className="stat-value">
                      {chapters[selectedLesson.chapter].exam.subject}
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">Time</div>
                    <div className="stat-value">
                      20 min
                    </div>
                  </div>
                </div>
              </div>
              
              {submissionStatus?.status === "success" && (
                <div className="result-card success">
                  <h3>Exam Submitted Successfully!</h3>
                  <div className="result-stats">
                    <div className="result-item">
                      <div className="result-label">Total Marks</div>
                      <div className="result-value">
                        {submissionStatus.data.totalMarks}
                      </div>
                    </div>
                    <div className="result-item highlight">
                      <div className="result-label">Obtained Marks</div>
                      <div className="result-value">
                        {submissionStatus.data.obtainedMarks}
                      </div>
                    </div>
                    <div className="result-item correct">
                      <div className="result-label">Correct Answers</div>
                      <div className="result-value">
                        <FaCheckCircle /> {submissionStatus.data.correctCount}
                      </div>
                    </div>
                    <div className="result-item wrong">
                      <div className="result-label">Wrong Answers</div>
                      <div className="result-value">
                        <FaTimesCircle /> {submissionStatus.data.wrongCount}
                      </div>
                    </div>
                    <div className="result-item">
                      <div className="result-label">Percentage</div>
                      <div className="result-value">
                        <BsGraphUp /> {Math.round((submissionStatus.data.obtainedMarks / submissionStatus.data.totalMarks) * 100)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="result-actions">
                    <button className="retake-button">Retake Exam</button>
                    <button className="continue-button">Continue Learning</button>
                  </div>
                </div>
              )}
              
              {submissionStatus?.status === "error" && (
                <div className="result-card error">
                  {submissionStatus.message}
                </div>
              )}
              
              <div className="questions-container">
                {chapters[selectedLesson.chapter].exam.examQuestions.map((q, i) => {
                  const questionKey = `${selectedLesson.chapter}-${i}`;
                  return (
                    <div key={i} className="question-card">
                      <div className="question-header">
                        <span className="question-number">
                          {i+1}
                        </span>
                        <h4>{q.question}</h4>
                      </div>
                      <div className="options-grid">
                        {q.options.map((opt, j) => (
                          <div 
                            key={j} 
                            className={`option-item ${examAnswers[questionKey] === opt ? 'selected' : ''}
                                          ${userProgress.attemptedExam ? 'disabled' : ''}`}
                            onClick={() => !userProgress.attemptedExam && handleAnswerSelect(questionKey, opt)}
                          >
                            <div className="option-letter">
                              {String.fromCharCode(65 + j)}
                            </div>
                            <div className="option-text">{opt}</div>
                            {examAnswers[questionKey] === opt && (
                              <div className="option-check">
                                <BsCheck2All />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="question-footer">
                        Marks: {q.marks}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {!userProgress.attemptedExam && submissionStatus?.status !== "success" && (
                <div className="exam-actions">
                  <button 
                    className="submit-button"
                    onClick={submitExam}
                    disabled={submissionStatus?.status === "submitting"}
                  >
                    {submissionStatus?.status === "submitting" ? (
                      <>
                        <div className="spinner small"></div>
                        Submitting...
                      </>
                    ) : 'Submit Exam'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="lesson-container">
              <div className="lesson-header">
                <h2>
                  {chapters[selectedLesson.chapter].lessons[selectedLesson.lesson].lessonname}
                </h2>
                <div className="lesson-stats">
                  <span className="stat-item">
                    <IoMdTime /> 15 min
                  </span>
                  <span className="stat-item">
                    <FaHeadphones /> {chapters[selectedLesson.chapter].lessons[selectedLesson.lesson].audioFile?.length || 0} lectures
                  </span>
                  <span className="stat-item">
                    <FaFilePdf /> {chapters[selectedLesson.chapter].lessons[selectedLesson.lesson].pdfFile?.length || 0} resources
                  </span>
                </div>
              </div>
              {renderMediaFiles(
                chapters[selectedLesson.chapter].lessons[selectedLesson.lesson],
                selectedLesson.chapter,
                selectedLesson.lesson
              )}
            </div>
          )
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FaPlay />
            </div>
            <h3>Select a lesson to get started</h3>
            <p>
              Choose a lesson or exam from the sidebar to view its content and start learning
            </p>
            <button className="start-button" onClick={() => setSelectedLesson({ chapter: 0, lesson: 0 })}>
              Start Learning
            </button>
          </div>
        )}
      </div>

      {/* Fixed Bottom Player */}
      {audioRef.current && (
        <div className="fixed-player">
          <div className="player-info">
            <div className="audio-name">
              {chapters[selectedLesson?.chapter]?.lessons[selectedLesson?.lesson]?.audioFile?.[currentAudioIndex]?.name || "Audio Lecture"}
            </div>
            <div className="lesson-name">
              {chapters[selectedLesson?.chapter]?.title || ""} • {chapters[selectedLesson?.chapter]?.lessons[selectedLesson?.lesson]?.lessonname || ""}
            </div>
          </div>
          
          <div className="player-controls">
            <button className="control-btn" onClick={skipToPrevAudio}>
              <FaStepBackward />
            </button>
            <button className="control-btn" onClick={skipBackward}>
              <FaBackward />
            </button>
            <button className="play-btn" onClick={playPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="control-btn" onClick={skipForward}>
              <FaForward />
            </button>
            <button className="control-btn" onClick={skipToNextAudio}>
              <FaStepForward />
            </button>
          </div>
          
          <div className="progress-container">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="progress-bar" onClick={handleSeek}>
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="total-time">{formatTime(duration)}</div>
          </div>
        </div>
      )}

      <style jsx>{`
        :root {
          --primary: #5624d0;
          --primary-light: #f0f2ff;
          --secondary: #3f37c9;
          --success: #1cb0a8;
          --danger: #e63757;
          --warning: #f8961e;
          --info: #4895ef;
          --dark: #1c1d1f;
          --light: #f8f9fa;
          --gray: #6a6f73;
          --light-gray: #d1d7dc;
          --white: #ffffff;
          --border-radius: 4px;
          --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.08);
          --transition: all 0.3s ease;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        body {
          background-color: #f7f9fa;
        }

        .course-content-container {
          display: flex;
          height: 100vh;
          background-color: #f7f9fa;
          overflow: hidden;
          position: relative;
        }

        /* Sidebar Toggle (Mobile) */
        .sidebar-toggle {
          display: none;
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 1000;
          background: var(--primary);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .sidebar-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        /* Sidebar Styles */
        .sidebar {
          width: 320px;
          height: 100%;
          background-color: var(--white);
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--light-gray);
          z-index: 10;
          transition: transform 0.3s ease;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            transform: translateX(-100%);
            width: 280px;
          }

          .sidebar.open {
            transform: translateX(0);
          }
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--light-gray);
          background: linear-gradient(to right, #5624d0, #7a5af5);
          color: white;
        }

        .course-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .stats {
          margin-top: 10px;
        }

        .progress-container {
          height: 6px;
          background-color: rgba(255,255,255,0.2);
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-bar {
          height: 100%;
          background-color: white;
          width: 35%;
        }

        .progress-text {
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .chapter-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px 0;
        }

        .chapter-item {
          margin-bottom: 4px;
        }

        .chapter-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          background-color: var(--white);
          transition: var(--transition);
          user-select: none;
          border-bottom: 1px solid var(--light-gray);
        }

        .chapter-header:hover {
          background-color: var(--light);
        }

        .chapter-header.expanded {
          background-color: var(--primary-light);
        }

        .chevron {
          margin-right: 12px;
          color: var(--gray);
          font-size: 0.9rem;
        }

        .chapter-info {
          flex: 1;
        }

        .chapter-info h4 {
          margin: 0;
          color: var(--dark);
          font-size: 0.95rem;
          font-weight: 700;
        }

        .chapter-meta {
          font-size: 0.8rem;
          color: var(--gray);
          margin-top: 4px;
        }

        .exam-badge {
          background-color: #e6fffa;
          color: #319795;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .lesson-list {
          margin-left: 28px;
          margin-top: 4px;
        }

        .lesson-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 4px;
          border-radius: 4px;
          cursor: pointer;
          background-color: var(--white);
          transition: var(--transition);
          position: relative;
        }

        .lesson-item:hover:not(.locked) {
          background-color: var(--light);
        }

        .lesson-item.active {
          background-color: var(--primary-light);
          border-left: 3px solid var(--primary);
        }

        .lesson-item.locked {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .lesson-icon {
          color: var(--gray);
          margin-right: 12px;
          font-size: 0.9rem;
        }

        .lesson-item.active .lesson-icon {
          color: var(--primary);
        }

        .lesson-item.locked .lesson-icon {
          color: var(--danger);
        }

        .lesson-info {
          flex: 1;
        }

        .lesson-name {
          font-weight: 500;
          color: var(--dark);
          font-size: 0.9rem;
          margin-bottom: 4px;
        }

        .lock-indicator {
          color: var(--danger);
          font-size: 0.8rem;
          margin-left: 6px;
        }

        .lesson-meta {
          display: flex;
          gap: 10px;
          font-size: 0.75rem;
          color: var(--gray);
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .meta-item.completed {
          color: var(--success);
        }

        .active-indicator {
          width: 8px;
          height: 8px;
          background-color: var(--primary);
          border-radius: 50%;
        }

        .exam-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 4px;
          border-radius: 4px;
          cursor: pointer;
          background-color: var(--white);
          transition: var(--transition);
        }

        .exam-item:hover:not(.disabled) {
          background-color: var(--light);
        }

        .exam-item.active {
          background-color: var(--primary-light);
          border-left: 3px solid var(--primary);
        }

        .exam-item.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .exam-icon {
          background-color: #e6fffa;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify: center;
          margin-right: 12px;
          color: #319795;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .exam-info {
          flex: 1;
        }

        .exam-name {
          font-weight: 500;
          color: var(--dark);
          font-size: 0.9rem;
          margin-bottom: 4px;
        }

        .exam-meta {
          font-size: 0.8rem;
          color: var(--gray);
        }

        .attempted-indicator {
          color: var(--success);
          font-size: 0.8rem;
          margin-left: 6px;
        }

        .locked-indicator {
          color: var(--danger);
          font-size: 0.8rem;
          margin-left: 6px;
        }

        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--light-gray);
          background-color: #f7f9fa;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-name {
          font-weight: 600;
          color: var(--dark);
        }

        /* Main Content Styles */
        .main-content {
          flex: 1;
          padding: 24px;
          overflow-y: auto;
          background-color: #f7f9fa;
        }

        @media (max-width: 768px) {
          .main-content {
            padding: 16px;
            padding-top: 60px;
          }
        }

        /* Lesson Container */
        .lesson-container {
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 32px;
          max-width: 800px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .lesson-container {
            padding: 20px;
          }
        }

        .lesson-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--light-gray);
        }

        .lesson-container h2 {
          margin-top: 0;
          margin-bottom: 8px;
          color: var(--dark);
        }

        .lesson-stats {
          display: flex;
          gap: 16px;
          font-size: 0.9rem;
          color: var(--gray);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Media Container */
        .media-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .lesson-description {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: var(--border-radius);
          margin-bottom: 10px;
          border-left: 3px solid var(--primary);
        }

        .description-title {
          color: var(--dark);
          margin-bottom: 12px;
          font-size: 1.1rem;
        }

        .description-text {
          color: var(--gray);
          line-height: 1.6;
        }

        /* Audio Section */
        .audio-section {
          margin-top: 20px;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--dark);
          margin-bottom: 16px;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .icon {
          color: var(--primary);
        }

        .audio-player {
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
        }

        .player-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background-color: #f9fafb;
          border-bottom: 1px solid var(--light-gray);
        }

        .player-title {
          flex: 1;
        }

        .now-playing {
          font-size: 0.8rem;
          color: var(--gray);
          margin-bottom: 4px;
        }

        .audio-name {
          font-weight: 600;
          color: var(--dark);
          font-size: 1rem;
        }

        .audio-meta {
          font-size: 0.9rem;
          color: var(--gray);
        }

        .player-controls {
          padding: 20px;
        }

        .progress-container {
          position: relative;
          height: 6px;
          background-color: var(--light-gray);
          border-radius: 3px;
          margin-bottom: 8px;
          cursor: pointer;
        }

        .progress-bar {
          height: 100%;
          background-color: var(--primary);
          width: 0%;
          border-radius: 3px;
        }

        .progress-thumb {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background-color: var(--primary);
          border-radius: 50%;
          margin-left: -6px;
        }

        .time-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--gray);
          margin-bottom: 16px;
        }

        .control-buttons {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
        }

        .control-btn {
          background: none;
          border: none;
          color: var(--dark);
          font-size: 1rem;
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }

        .control-btn:hover {
          background-color: var(--primary-light);
          color: var(--primary);
        }

        .play-btn {
          background-color: var(--primary);
          color: white;
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
        }

        .play-btn:hover {
          background-color: #3f0fb7;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: 16px;
        }

        .volume-slider {
          width: 80px;
          height: 4px;
          -webkit-appearance: none;
          background: var(--light-gray);
          border-radius: 2px;
          outline: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: var(--primary);
          border-radius: 50%;
          cursor: pointer;
        }

        .playback-rate {
          position: relative;
        }

        .rate-btn {
          background: none;
          border: 1px solid var(--light-gray);
          color: var(--dark);
          padding: 4px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .rate-btn:hover {
          background-color: var(--light);
        }

        .rate-options {
          position: absolute;
          bottom: 100%;
          left: 0;
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 8px;
          min-width: 80px;
          z-index: 10;
        }

        .rate-option {
          display: block;
          width: 100%;
          padding: 8px 12px;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 0.9rem;
          color: var(--dark);
        }

        .rate-option:hover {
          background-color: var(--light);
        }

        .rate-option.active {
          color: var(--primary);
          font-weight: 600;
        }

        .audio-list {
          padding: 0 16px 16px;
        }

        .audio-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }

        .audio-item:hover {
          background-color: var(--light);
        }

        .audio-item.active {
          background-color: var(--primary-light);
        }

        .audio-info {
          flex: 1;
        }

        .audio-name {
          font-weight: 500;
          color: var(--dark);
          margin-bottom: 4px;
          font-size: 0.95rem;
        }

        .audio-meta {
          display: flex;
          gap: 12px;
          font-size: 0.8rem;
          color: var(--gray);
        }

        .play-indicator {
          color: var(--primary);
          font-size: 1rem;
        }

        /* PDF Section */
        .pdf-section {
          margin-top: 20px;
        }

        .pdf-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 16px;
        }

        @media (max-width: 600px) {
          .pdf-grid {
            grid-template-columns: 1fr;
          }
        }

        .pdf-card {
          background-color: var(--white);
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          text-decoration: none;
          color: var(--dark);
          display: flex;
          flex-direction: column;
          border: 1px solid var(--light-gray);
        }

        .pdf-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border-color: var(--primary);
        }

        .pdf-icon {
          background-color: #fff5f5;
          color: #e53e3e;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .pdf-details {
          padding: 16px;
          flex: 1;
        }

        .pdf-name {
          font-weight: 500;
          margin-bottom: 8px;
        }

        .pdf-meta {
          font-size: 0.8rem;
          color: var(--gray);
        }

        .download-badge {
          background-color: var(--primary-light);
          color: var(--primary);
          padding: 8px 16px;
          text-align: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* Lesson Actions */
        .lesson-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid var(--light-gray);
        }

        .complete-lesson-button {
          background-color: var(--success);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
        }

        .complete-lesson-button:hover {
          background-color: #18968f;
        }

        .completion-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #f0fff4;
          color: #38a169;
          padding: 12px 20px;
          border-radius: 4px;
          font-weight: 600;
        }

        .audio-navigation {
          display: flex;
          gap: 12px;
        }

        .nav-button {
          background: none;
          border: 1px solid var(--light-gray);
          color: var(--dark);
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: var(--transition);
        }

        .nav-button:hover {
          background-color: var(--light);
        }

        .nav-button.next {
          background-color: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .nav-button.next:hover {
          background-color: #3f0fb7;
        }

        .nav-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Exam Container */
        .exam-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .exam-header {
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 24px;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .exam-header {
            padding: 16px;
          }
        }

        .exam-header h2 {
          margin-top: 0;
          margin-bottom: 16px;
          color: var(--dark);
        }

        .exam-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .stat-item {
          background-color: var(--primary-light);
          padding: 12px 20px;
          border-radius: 8px;
          min-width: 120px;
        }

        @media (max-width: 600px) {
          .stat-item {
            min-width: 100px;
            padding: 10px 12px;
          }
        }

        .stat-label {
          color: var(--gray);
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .stat-value {
          font-weight: 600;
          color: var(--dark);
        }

        /* Result Card */
        .result-card {
          border-radius: var(--border-radius);
          padding: 20px;
          margin-bottom: 24px;
        }

        .result-card.success {
          background-color: #f0fff4;
          border: 1px solid #c6f6d5;
        }

        .result-card.error {
          background-color: #fff5f5;
          border: 1px solid #fed7d7;
          color: #e53e3e;
        }

        .result-card h3 {
          margin-top: 0;
          margin-bottom: 16px;
        }

        .result-card.success h3 {
          color: #38a169;
        }

        .result-stats {
          display: flex;
          gap: 20px;
          margin-top: 10px;
          flex-wrap: wrap;
        }

        .result-item {
          min-width: 120px;
        }

        .result-item.highlight {
          min-width: 140px;
        }

        .result-label {
          color: var(--gray);
          font-size: 0.85rem;
          margin-bottom: 4px;
        }

        .result-value {
          font-weight: 600;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .result-item.highlight .result-value {
          font-size: 1.3rem;
          color: var(--dark);
        }

        .result-item.correct .result-value {
          color: #38a169;
        }

        .result-item.wrong .result-value {
          color: #e53e3e;
        }

        .result-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .retake-button, .continue-button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
        }

        .retake-button {
          background-color: var(--light);
          color: var(--dark);
        }

        .retake-button:hover {
          background-color: #e2e6ea;
        }

        .continue-button {
          background-color: var(--primary);
          color: white;
        }

        .continue-button:hover {
          background-color: #3f0fb7;
        }

        /* Questions Container */
        .questions-container {
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 24px;
          margin-bottom: 24px;
        }

        @media (max-width: 768px) {
          .questions-container {
            padding: 16px;
          }
        }

        .question-card {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--light-gray);
        }

        .question-card:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        .question-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .question-number {
          background-color: var(--primary);
          color: white;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .question-header h4 {
          margin: 0;
          font-weight: 500;
        }

        .options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .options-grid {
            grid-template-columns: 1fr;
          }
        }

        .option-item {
          padding: 16px;
          border-radius: 8px;
          border: 1px solid var(--light-gray);
          background-color: var(--white);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .option-item:hover:not(.disabled) {
          border-color: var(--primary);
        }

        .option-item.selected {
          background-color: var(--primary-light);
          border-color: var(--primary);
        }

        .option-item.disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .option-letter {
          font-weight: 600;
          margin-right: 12px;
          color: var(--primary);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .option-item.selected .option-letter {
          background-color: var(--primary);
          color: white;
        }

        .option-text {
          flex: 1;
        }

        .option-check {
          margin-left: 12px;
          color: var(--primary);
          opacity: 0;
          transition: var(--transition);
        }

        .option-item.selected .option-check {
          opacity: 1;
        }

        .question-footer {
          display: flex;
          justify-content: flex-end;
          font-size: 0.9rem;
          color: var(--gray);
        }

        /* Exam Actions */
        .exam-actions {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }

        .submit-button {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .submit-button:hover {
          background-color: #3f0fb7;
        }

        .submit-button:disabled {
          background-color: var(--gray);
          cursor: not-allowed;
        }

        /* Empty State */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: var(--gray);
          padding: 20px;
        }

        .empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: var(--primary-light);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          color: var(--primary);
          font-size: 2rem;
        }

        .empty-state h3 {
          color: var(--dark);
          margin-bottom: 8px;
          font-size: 1.5rem;
        }

        .empty-state p {
          max-width: 400px;
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .start-button {
          background-color: var(--primary);
          color: white;
          border: none;
          padding: 12px 32px;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
          font-size: 1rem;
          transition: var(--transition);
        }

        .start-button:hover {
          background-color: #3f0fb7;
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: var(--gray);
          gap: 16px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--light-gray);
          border-top: 4px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner.small {
          width: 20px;
          height: 20px;
          border-width: 2px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Error State */
        .error-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          color: var(--danger);
          gap: 16px;
          text-align: center;
          padding: 20px;
        }

        .error-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #fff5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          color: var(--danger);
        }

        .error-message {
          font-size: 1.1rem;
          margin-bottom: 8px;
        }

        .retry-button {
          background-color: var(--danger);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }

        .retry-button:hover {
          background-color: #d1145a;
        }

        /* Fixed Player */
        .fixed-player {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: white;
          box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 24px;
          z-index: 1000;
        }

        .player-info {
          flex: 1;
          min-width: 0;
        }

        .audio-name {
          font-weight: 600;
          color: var(--dark);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .lesson-name {
          font-size: 0.85rem;
          color: var(--gray);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .player-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .fixed-player .play-btn {
          width: 36px;
          height: 36px;
          font-size: 0.9rem;
        }

        .fixed-player .control-btn {
          font-size: 0.9rem;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 300px;
        }

        .fixed-player .progress-bar {
          flex: 1;
          height: 4px;
          background-color: var(--light-gray);
          border-radius: 2px;
          position: relative;
          cursor: pointer;
        }

        .fixed-player .progress {
          height: 100%;
          background-color: var(--primary);
          border-radius: 2px;
        }

        .current-time, .total-time {
          font-size: 0.8rem;
          color: var(--gray);
        }

        @media (max-width: 768px) {
          .fixed-player {
            flex-direction: column;
            padding: 12px;
            gap: 12px;
          }
          
          .player-info {
            width: 100%;
          }
          
          .player-controls {
            width: 100%;
            justify-content: center;
          }
          
          .progress-container {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}