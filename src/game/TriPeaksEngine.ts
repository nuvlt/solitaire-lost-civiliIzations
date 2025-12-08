import { Card, Suit, Rank, GameState } from '../types/game';
import { SUITS, RANKS } from '../constants/game';

export class TriPeaksEngine {
  /**
   * Creates a shuffled deck of 52 cards
   */
  static createDeck(): Card[] {
    const deck: Card[] = [];
    let id = 0;

    for (const suit of SUITS) {
      for (const rank of RANKS) {
        deck.push({
          id: `${suit}-${rank}-${id++}`,
          suit,
          rank,
          faceUp: false,
          position: { row: 0, col: 0 },
        });
      }
    }

    return this.shuffleDeck(deck);
  }

  /**
   * Fisher-Yates shuffle
   */
  static shuffleDeck(deck: Card[]): Card[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Initialize TriPeaks layout
   * 3 peaks, 28 cards total in tableau
   * Layout:
   *       [X]       [X]       [X]          <- Peak tops (row 0)
   *      [X][X]    [X][X]    [X][X]        <- row 1
   *     [X][X][X] [X][X][X] [X][X][X]      <- row 2
   *    [X][X][X][X][X][X][X][X][X][X]      <- Base row (row 3, all face up)
   */
  static dealTriPeaks(deck: Card[]): GameState {
    const tableau: Card[][] = [[], [], [], []];
    let cardIndex = 0;

    // Row 0: 3 peaks (face down)
    for (let i = 0; i < 3; i++) {
      const card = { ...deck[cardIndex++], position: { row: 0, col: i * 3 } };
      tableau[0].push(card);
    }

    // Row 1: 6 cards (face down)
    for (let i = 0; i < 6; i++) {
      const card = { ...deck[cardIndex++], position: { row: 1, col: i } };
      tableau[1].push(card);
    }

    // Row 2: 9 cards (face down)
    for (let i = 0; i < 9; i++) {
      const card = { ...deck[cardIndex++], position: { row: 2, col: i } };
      tableau[2].push(card);
    }

    // Row 3: 10 cards (face up - base row)
    for (let i = 0; i < 10; i++) {
      const card = { ...deck[cardIndex++], position: { row: 3, col: i }, faceUp: true };
      tableau[3].push(card);
    }

    // Remaining cards go to stock
    const stock = deck.slice(cardIndex);
    const waste = [stock[0]]; // First card goes to waste
    const remainingStock = stock.slice(1);

    return {
      tableau,
      stock: remainingStock,
      waste,
      score: 0,
      moves: 0,
      streak: 0,
      gameWon: false,
      gameLost: false,
    };
  }

  /**
   * Check if a card can be played on the waste pile
   * Rule: Card must be one rank higher or lower than waste top
   */
  static canPlayCard(card: Card, wasteTop: Card): boolean {
    const rankValues: Record<Rank, number> = {
      A: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7,
      '8': 8, '9': 9, '10': 10, J: 11, Q: 12, K: 13,
    };

    const cardValue = rankValues[card.rank];
    const wasteValue = rankValues[wasteTop.rank];

    // Ace can wrap around (A-K or A-2)
    if (cardValue === 1 && wasteValue === 13) return true;
    if (cardValue === 13 && wasteValue === 1) return true;

    return Math.abs(cardValue - wasteValue) === 1;
  }

  /**
   * Check if a card is playable (not covered by other cards)
   */
  static isCardPlayable(card: Card, tableau: Card[][]): boolean {
    if (!card.faceUp) return false;

    const { row, col } = card.position;

    // Base row is always playable if face up
    if (row === 3) return true;

    // Check if card is covered by cards below
    const cardsBelow = tableau[row + 1];
    
    // For row 0 (peaks), check positions col and col+1 in row 1
    if (row === 0) {
      const coveringPositions = [col * 2, col * 2 + 1];
      return !cardsBelow.some(c => coveringPositions.includes(c.position.col));
    }

    // For row 1 and 2, check overlapping positions
    const coveringPositions = [col, col + 1];
    return !cardsBelow.some(c => coveringPositions.includes(c.position.col));
  }

  /**
   * Get all currently playable cards
   */
  static getPlayableCards(tableau: Card[][]): Card[] {
    const playable: Card[] = [];

    for (const row of tableau) {
      for (const card of row) {
        if (this.isCardPlayable(card, tableau)) {
          playable.push(card);
        }
      }
    }

    return playable;
  }

  /**
   * Play a card from tableau to waste
   */
  static playCard(gameState: GameState, card: Card): GameState {
    const newTableau = gameState.tableau.map(row =>
      row.filter(c => c.id !== card.id)
    );

    // Flip cards that are now uncovered
    this.flipUncoveredCards(newTableau);

    const newWaste = [...gameState.waste, card];
    const newStreak = gameState.streak + 1;

    return {
      ...gameState,
      tableau: newTableau,
      waste: newWaste,
      moves: gameState.moves + 1,
      streak: newStreak,
      score: gameState.score + (10 * newStreak), // Streak bonus
    };
  }

  /**
   * Flip cards that should be face up (not covered)
   */
  static flipUncoveredCards(tableau: Card[][]): void {
    for (let row = 0; row < tableau.length; row++) {
      for (const card of tableau[row]) {
        if (!card.faceUp && this.isCardPlayable({ ...card, faceUp: true }, tableau)) {
          card.faceUp = true;
        }
      }
    }
  }

  /**
   * Draw a card from stock to waste
   */
  static drawFromStock(gameState: GameState): GameState {
    if (gameState.stock.length === 0) return gameState;

    const newStock = gameState.stock.slice(1);
    const drawnCard = gameState.stock[0];
    const newWaste = [...gameState.waste, drawnCard];

    return {
      ...gameState,
      stock: newStock,
      waste: newWaste,
      streak: 0, // Reset streak when drawing
    };
  }

  /**
   * Check if game is won (all tableau cards removed)
   */
  static isGameWon(gameState: GameState): boolean {
    return gameState.tableau.every(row => row.length === 0);
  }

  /**
   * Check if game is lost (no playable moves and no stock)
   */
  static isGameLost(gameState: GameState): boolean {
    if (gameState.stock.length > 0) return false;

    const playableCards = this.getPlayableCards(gameState.tableau);
    const wasteTop = gameState.waste[gameState.waste.length - 1];

    return !playableCards.some(card => this.canPlayCard(card, wasteTop));
  }
}
