import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quiz-results',
  imports: [CommonModule],
  templateUrl: './quiz-results.html',
  styleUrl: './quiz-results.scss'
})
export class QuizResults implements OnInit {
  quizId: string = '';
  quiz: any = null;
  participants: number = 0;
  totalAns: number = 0;
  submittedAnswers: any[] = [];
  isLoading: boolean = true;
  error: string | null = null;
  
  // properties for LLM analysis
  isLoadingSummary: boolean = false;
  summaryError: string | null = null;
  llmSummary: any = null;
  summaryGenerated: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    // fetch quiz id from route url
    this.quizId = this.route.snapshot.params['id'] || 'Unknown';

    // Fetch participant and answer count from router state variable
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.participants = navigation.extras.state['participants'] || 0;
      this.totalAns = navigation.extras.state['totalAns'] || 0;
      this.submittedAnswers = navigation.extras.state['submittedAnswers'] || [];  // fetching answers from active quiz
    }
  }

  ngOnInit(): void {
    this.quizId = this.route.snapshot.params['id'];
    this.loadQuizData();
    
    // Only start LLM analysis if we have answers
    if (this.submittedAnswers.length > 0) {
      this.generateTopicSummary();
    } else {
      console.log('No submitted answers to analyze');
      this.summaryError = 'No answers were submitted for this quiz';
    }
  }

  loadQuizData(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<{ ok: boolean; message: string; quiz: any }>(`http://localhost:3000/api/quiz/${this.quizId}`)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.quiz = response.quiz;
            this.loadQuizMetrics();
          } else {
            this.error = response.message || 'Failed to load quiz data';
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading quiz:', error);
          this.error = 'Failed to load quiz data. Please try again.';
          this.isLoading = false;
        }
      });
  }

  // Add new method for LLM topic analysis
  generateTopicSummary(): void {
    this.isLoadingSummary = true;
    this.summaryError = null;

    console.log('Starting LLM topic analysis for quiz:', this.quizId);
    console.log('Submitted answers:', this.submittedAnswers);

    // Extract just the answer text from the answer objects
    const answerTexts = this.submittedAnswers.map(answerObj => answerObj.answer);

    this.http.post<{ 
      success: boolean; 
      summary?: string; 
      topics?: string[]; 
      correctness?: number;
      error?: string; 
    }>(`http://localhost:3000/api/summarize_cats`, {
      quizId: this.quizId,
      answers: answerTexts
    })
    .subscribe({
      next: (response) => {
        console.log('LLM Analysis Response:', response);
        
        if (response.success) {
          this.llmSummary = {
            summary: response.summary || 'No summary available',
            topics: response.topics || [],
            correctness: response.correctness || 0
          };
          this.summaryGenerated = true;
        } else {
          this.summaryError = response.error || 'Failed to generate topic summary';
        }
        this.isLoadingSummary = false;
      },
      error: (error) => {
        console.error('Error generating LLM summary:', error);
        this.summaryError = 'Failed to analyze answers. The LLM service may be unavailable.';
        this.isLoadingSummary = false;
      }
    });
  }

  // retry LLM analysis
  retryTopicSummary(): void {
    this.generateTopicSummary();
  }

  
  
  loadQuizMetrics(): void {
    // Your existing loadQuizMetrics implementation
  }

  getDifficultyLevel(): number {
    return this.quiz?.difficulty || 3;
  }

  getDifficultyText(): string {
    const level = this.getDifficultyLevel();
    const difficultyMap: { [key: number]: string } = {
      1: 'Very Easy',
      2: 'Easy', 
      3: 'Moderate',
      4: 'Hard',
      5: 'Very Hard'
    };
    return difficultyMap[level] || 'Moderate';
  }

  navigateToQuizMaster(): void {
    this.router.navigate(['/quiz-master']);
  }

  viewQuiz(): void {
    this.router.navigate(['/quiz-list']);
  }

  getSummaryTopics(): string[] {
    if (!this.llmSummary?.summary) return [];
    
    return this.llmSummary.summary
      .replace(/[-•]/g, ',') 
      .split(/[,\n]/) 
      .map((topic: string) => topic.trim()) 
      .filter((topic: string) => topic.length > 0 && topic.length < 50) 
      .slice(0, 5); // limit to 5 topics max for now!
  }
}
