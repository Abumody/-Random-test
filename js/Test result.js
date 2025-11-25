document.addEventListener('DOMContentLoaded', function() {
            const studentNameDisplay = document.getElementById('studentName');
            const emptyState = document.getElementById('emptyState');
            const resultsSummary = document.getElementById('resultsSummary');
            const resultsTableContainer = document.getElementById('resultsTableContainer');
            const resultsTableBody = document.getElementById('resultsTableBody');
            
            // Set student name
            const studentName = localStorage.getItem('studentName') || 'Student Name';
            studentNameDisplay.textContent = studentName;
            
            // Check if there are any completed tests
            const completedTests = JSON.parse(localStorage.getItem('completedTests')) || [];
            
            if (completedTests.length > 0) {
                // Show results table and hide empty state
                emptyState.style.display = 'none';
                resultsSummary.style.display = 'grid';
                resultsTableContainer.style.display = 'block';
                
                // Populate the table with completed tests
                populateResultsTable(completedTests);
                updateSummaryStats(completedTests);
            }
            
            function populateResultsTable(tests) {
                // Define all available tests
                const allTests = [
                    { year: 2023, session: 1 },
                    { year: 2023, session: 2 },
                    { year: 2022, session: 1 },
                    { year: 2022, session: 2 },
                    { year: 2021, session: 1 },
                    { year: 2021, session: 2 },
                    { year: 2020, session: 1 },
                    { year: 2020, session: 2 },
                    { year: 2019, session: 1 },
                    { year: 2019, session: 2 },
                    { year: 2018, session: 1 },
                    { year: 2018, session: 2 }
                ];
                
                allTests.forEach(test => {
                    const completedTest = tests.find(t => t.year === test.year && t.session === test.session);
                    const row = document.createElement('tr');
                    
                    if (completedTest) {
                        // Test is completed
                        row.innerHTML = `
                            <td class="test-name">${test.year} - Session ${test.session}</td>
                            <td>
                                <span class="status status-completed">
                                    <i class="fas fa-check-circle"></i> Completed
                                </span>
                            </td>
                            <td>
                                <span class="score">${completedTest.score}%</span>
                            </td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${completedTest.score}%"></div>
                                </div>
                            </td>
                            <td>${completedTest.date}</td>
                            <td class="actions">
                                <button class="action-btn action-view" onclick="viewTestDetails(${test.year}, ${test.session})">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="action-btn action-start" onclick="retakeTest(${test.year}, ${test.session})">
                                    <i class="fas fa-redo"></i> Retake
                                </button>
                            </td>
                        `;
                    } else {
                        // Test is not started
                        row.innerHTML = `
                            <td class="test-name">${test.year} - Session ${test.session}</td>
                            <td>
                                <span class="status status-not-started">
                                    <i class="fas fa-clock"></i> Not Started
                                </span>
                            </td>
                            <td>
                                <span class="score">-</span>
                            </td>
                            <td>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 0%"></div>
                                </div>
                            </td>
                            <td>-</td>
                            <td class="actions">
                                <button class="action-btn action-start" onclick="startTest(${test.year}, ${test.session})">
                                    <i class="fas fa-play"></i> Start
                                </button>
                            </td>
                        `;
                    }
                    
                    resultsTableBody.appendChild(row);
                });
            }
            
            function updateSummaryStats(tests) {
                const totalTests = 12; // Total available tests
                const completedTests = tests.length;
                
                document.getElementById('totalTests').textContent = totalTests;
                document.getElementById('completedTests').textContent = completedTests;
                
                if (completedTests > 0) {
                    const totalScore = tests.reduce((sum, test) => sum + test.score, 0);
                    const averageScore = Math.round(totalScore / completedTests);
                    const highestScore = Math.max(...tests.map(test => test.score));
                    
                    document.getElementById('averageScore').textContent = `${averageScore}%`;
                    document.getElementById('highestScore').textContent = `${highestScore}%`;
                }
            }
        });
        
        // These functions would be implemented in a real application
        function startTest(year, session) {
            alert(`Starting ${year} - Session ${session}`);
            // In real app: window.location.href = `test-${year}-session-${session}.html`;
        }
        
        function retakeTest(year, session) {
            alert(`Retaking ${year} - Session ${session}`);
            // In real app: window.location.href = `test-${year}-session-${session}.html`;
        }
        
        function viewTestDetails(year, session) {
            alert(`Viewing details for ${year} - Session ${session}`);
            // In real app: window.location.href = `test-details-${year}-session-${session}.html`;
        }