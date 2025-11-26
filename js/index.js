document.addEventListener('DOMContentLoaded', function() {
            const loginBtn = document.getElementById('loginBtn');
            const studentNameInput = document.getElementById('studentNameInput');
            
            // Login button event
            loginBtn.addEventListener('click', function() {
                const studentName = studentNameInput.value.trim();
                
                if (studentName === '') {
                    alert('Please enter your name');
                    return;
                }
                
                // Store student name in localStorage for use in test pages
                localStorage.setItem('studentName', studentName);
                
                // Redirect to the test selection page
                window.location.href = 'Dashboard.html';
            });
            
            // Allow login with Enter key
            studentNameInput.addEventListener('keyup', function(e) {
                if (e.key === 'Enter') {
                    loginBtn.click();
                }
            });
        });
