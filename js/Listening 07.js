// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeAudioPlayer();
    initializeQuestionHandlers();
});

// Audio Player Functions
function initializeAudioPlayer() {
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const progressBar = document.getElementById('progressBar');
    const progressContainer = document.getElementById('progressContainer');
    const timeDisplay = document.getElementById('timeDisplay');
    const volumeSlider = document.getElementById('volumeSlider');

    if (!audio || !playBtn) return;

    // Format time as minutes:seconds
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update time display
    function updateTimeDisplay() {
        if (audio.duration && !isNaN(audio.duration)) {
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
        } else {
            timeDisplay.textContent = `${formatTime(audio.currentTime)} / 0:00`;
        }
    }

    // Update progress bar
    function updateProgress() {
        if (audio.duration && !isNaN(audio.duration)) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
        }
        updateTimeDisplay();
    }

    // Set progress bar when clicked
    function setProgress(e) {
        if (!audio.duration || isNaN(audio.duration)) return;
        
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        
        audio.currentTime = (clickX / width) * duration;
    }

    // Toggle play/pause
    function togglePlay() {
        if (audio.paused) {
            audio.play().catch(error => {
                console.error("Audio play failed:", error);
                alert("Unable to play audio. Please check if the audio file exists.");
            });
            playBtn.textContent = '⏸';
            playBtn.classList.add('playing');
        } else {
            audio.pause();
            playBtn.textContent = '▶';
            playBtn.classList.remove('playing');
        }
    }

    // Update volume
    function setVolume() {
        audio.volume = volumeSlider.value;
    }

    // Event listeners
    playBtn.addEventListener('click', togglePlay);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', function() {
        playBtn.textContent = '▶';
        playBtn.classList.remove('playing');
    });
    audio.addEventListener('loadedmetadata', updateTimeDisplay);
    audio.addEventListener('error', function() {
        console.error("Audio loading error");
        timeDisplay.textContent = "Audio Error";
    });
    
    if (progressContainer) {
        progressContainer.addEventListener('click', setProgress);
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', setVolume);
    }

    // Initial setup
    updateTimeDisplay();
}

// Question Handling Functions
function initializeQuestionHandlers() {
    // Add click event to options
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options in this question
            const question = this.closest('.question');
            question.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            this.classList.add('selected');
        });
    });
}

// Calculate score for this listening test
function calculateScore() {
    let correctCount = 0;
    const totalQuestions = document.querySelectorAll('.question').length;
    
    document.querySelectorAll('.question').forEach(question => {
        const correctAnswer = question.getAttribute('data-correct');
        const selectedOption = question.querySelector('.option.selected');
        
        if (selectedOption) {
            const selectedAnswer = selectedOption.querySelector('.option-text').textContent;
            if (selectedAnswer === correctAnswer) {
                correctCount++;
            }
        }
    });
    
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    return percentage;
}

// Check answers function - UPDATED WITH COMPLETION TRACKING
function checkAnswers() {
    let correctCount = 0;
    const totalQuestions = document.querySelectorAll('.question').length;
    
    document.querySelectorAll('.question').forEach(question => {
        const correctAnswer = question.getAttribute('data-correct');
        const selectedOption = question.querySelector('.option.selected');
        
        // Reset previous correct/incorrect classes
        question.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('correct', 'incorrect');
        });
        
        if (selectedOption) {
            const selectedAnswer = selectedOption.querySelector('.option-text').textContent;
            
            if (selectedAnswer === correctAnswer) {
                selectedOption.classList.add('correct');
                correctCount++;
            } else {
                selectedOption.classList.add('incorrect');
                
                // Highlight the correct answer
                question.querySelectorAll('.option').forEach(opt => {
                    if (opt.querySelector('.option-text').textContent === correctAnswer) {
                        opt.classList.add('correct');
                    }
                });
            }
        } else {
            // If no answer selected, show correct answer
            question.querySelectorAll('.option').forEach(opt => {
                if (opt.querySelector('.option-text').textContent === correctAnswer) {
                    opt.classList.add('correct');
                }
            });
        }
    });
    
    // Calculate score percentage
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    
    // MARK SECTION AS COMPLETED using results-tracker.js
    if (typeof markSectionCompleted !== 'undefined') {
        markSectionCompleted('listening1', scorePercentage);
        console.log(`Listening 1 completed with score: ${scorePercentage}%`);
    } else {
        console.warn('results-tracker.js not loaded - completion not tracked');
        // Fallback: Use localStorage directly
        const testId = "2023-session1";
        const progressKey = `testProgress_${testId}`;
        const existingProgress = localStorage.getItem(progressKey);
        let progress = existingProgress ? JSON.parse(existingProgress) : { 
            testId: testId,
            answers: {},
            startTime: new Date()
        };
        
        progress.answers['listening1'] = {
            page: 'listening1',
            score: scorePercentage,
            completedAt: new Date(),
            status: 'completed'
        };
        
        localStorage.setItem(progressKey, JSON.stringify(progress));
    }
    
    // Show results
    const results = document.getElementById('results');
    const scoreValue = document.getElementById('score-value');
    const feedback = document.getElementById('feedback');
    
    if (results && scoreValue && feedback) {
        scoreValue.textContent = correctCount;
        results.classList.add('show');
        
        // Provide feedback based on score
        if (correctCount === totalQuestions) {
            feedback.textContent = "Excellent! You got all answers correct!";
        } else if (correctCount >= totalQuestions * 0.7) {
            feedback.textContent = "Good job! You did well on this exercise.";
        } else if (correctCount >= totalQuestions * 0.5) {
            feedback.textContent = "Not bad, but you might want to review the material.";
        } else {
            feedback.textContent = "You may need more practice with this topic.";
        }
        
        // Scroll to results
        results.scrollIntoView({ behavior: 'smooth' });
    }
    
    return scorePercentage;
}

// Reset answers function
function resetAnswers() {
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Hide results
    const results = document.getElementById('results');
    if (results) {
        results.classList.remove('show');
    }
}

// Complete listening test and return to main page
function completeListeningTest() {
    const score = calculateScore();
    
    // Mark as completed
    if (typeof markSectionCompleted !== 'undefined') {
        markSectionCompleted('listening1', score);
    }
    
    alert(`Listening 1 completed! Score: ${score}%`);
    
    // Force page reload to show updated status
    window.location.href = "Test 2023 - session 1.html?refresh=" + Date.now();
}

// Go back to main page function
function goBack() {
    // Force refresh
    window.location.href = "Test 2023 - session 1.html?refresh=" + Date.now();
}
