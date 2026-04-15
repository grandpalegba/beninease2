// Game Logic pour Le Sato Challenge
// Système de vies (Awalé) et chronomètre (Okpele)

export class GameLogic {
  constructor() {
    this.lives = 8; // 8 sacred-seed au total
    this.maxLives = 8;
    this.timePerQuestion = 8; // 1 cauri = 8 secondes
    this.totalTime = 64; // 4 questions x 16 secondes
    this.currentQuestion = 0;
    this.timer = null;
    this.gameState = 'playing'; // 'playing', 'gameover', 'completed'
  }

  // Gestion des vies
  loseLife() {
    if (this.lives > 0) {
      this.lives--;
      this.updateLifeDisplay();
      
      if (this.lives === 0) {
        this.gameOver();
      }
    }
  }

  updateLifeDisplay() {
    const holes = document.querySelectorAll('.sacred-seed');
    holes.forEach((hole, index) => {
      if (index < this.lives) {
        hole.style.opacity = '1';
        hole.parentElement.classList.add('husk-active');
      } else {
        hole.style.opacity = '0.3';
        hole.parentElement.classList.remove('husk-active');
        hole.parentElement.classList.add('husk-inactive');
      }
    });
  }

  // Gestion du chronomètre
  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      this.totalTime--;
      this.updateTimerDisplay();
      
      if (this.totalTime <= 0) {
        this.gameOver();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  updateTimerDisplay() {
    const cauris = document.querySelectorAll('.husk-shape');
    const activeCount = Math.max(0, Math.floor(this.totalTime / 8));
    
    cauris.forEach((cauri, index) => {
      if (index < activeCount) {
        cauri.classList.add('husk-active');
        cauri.classList.remove('husk-inactive');
      } else {
        cauri.classList.remove('husk-active');
        cauri.classList.add('husk-inactive');
      }
    });
  }

  // Gestion du jeu
  checkAnswer(selectedAnswer) {
    if (this.gameState !== 'playing') return false;
    
    const isCorrect = this.validateAnswer(selectedAnswer);
    
    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleWrongAnswer();
    }
    
    return isCorrect;
  }

  handleCorrectAnswer() {
    // Animation de succès
    this.showFeedback(true);
    
    // Passer à la question suivante
    setTimeout(() => {
      this.currentQuestion++;
      if (this.currentQuestion >= 4) {
        this.gameCompleted();
      } else {
        this.showNextQuestion();
      }
    }, 1000);
  }

  handleWrongAnswer() {
    this.loseLife();
    this.showFeedback(false);
  }

  showFeedback(isCorrect) {
    const button = document.querySelector(`[data-answer="${this.currentAnswer}"]`);
    if (button) {
      if (isCorrect) {
        button.classList.add('bg-success', 'text-white');
        button.classList.remove('bg-primary', 'text-on-primary');
      } else {
        button.classList.add('bg-error', 'text-white');
        button.classList.remove('bg-primary', 'text-on-primary');
      }
    }
  }

  showNextQuestion() {
    // Logique pour afficher la question suivante
    this.updateQuestionDisplay();
    this.resetAnswerButtons();
  }

  updateQuestionDisplay() {
    // À implémenter selon les données du jeu
    console.log(`Question ${this.currentQuestion + 1}/4`);
  }

  resetAnswerButtons() {
    const buttons = document.querySelectorAll('[data-answer]');
    buttons.forEach(button => {
      button.classList.remove('bg-success', 'bg-error', 'text-white');
      button.classList.add('bg-primary', 'text-on-primary');
    });
  }

  gameOver() {
    this.gameState = 'gameover';
    this.stopTimer();
    this.showGameOverScreen();
  }

  gameCompleted() {
    this.gameState = 'completed';
    this.stopTimer();
    this.showCompletionScreen();
  }

  showGameOverScreen() {
    // Afficher l'écran Game Over
    console.log('Game Over - Plus de vies');
  }

  showCompletionScreen() {
    // Afficher l'écran de complétion
    console.log('Game Completed - Tous les savoirs débloqués');
  }

  validateAnswer(answer) {
    // À implémenter selon la logique du jeu
    // Retourne true si la réponse est correcte
    return true; // Placeholder
  }

  reset() {
    this.lives = 8;
    this.currentQuestion = 0;
    this.totalTime = 64;
    this.gameState = 'playing';
    this.stopTimer();
    this.updateLifeDisplay();
    this.updateTimerDisplay();
  }
}
