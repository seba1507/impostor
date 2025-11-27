export enum GamePhase {
  SETUP = 'SETUP',
  CATEGORY_SELECT = 'CATEGORY_SELECT',
  REVEAL = 'REVEAL',
  DISCUSSION = 'DISCUSSION',
  VOTING = 'VOTING',
  RESULT = 'RESULT',
}

export interface Category {
  id: string;
  name: string;
  icon: string; // Emoji or simple string identifier
  color: string;
  words: string[];
}

export interface GameState {
  phase: GamePhase;
  players: string[];
  impostorIndex: number | null;
  selectedCategoryId: string | null;
  currentWord: string | null;
  currentRevealIndex: number;
  isRevealingCard: boolean; // True if the card is currently flipped over showing the role
  votedPlayerIndex: number | null; // Index of the player voted out
  discussionTimeLeft: number; // Seconds remaining in discussion
  // Voting state
  votes: Record<number, number>; // Key: Voter Index, Value: Suspect Index (-1 for skip)
  currentVoterIndex: number;
  isVotingTurn: boolean; // False = Pass phone screen, True = Voting selection screen
}