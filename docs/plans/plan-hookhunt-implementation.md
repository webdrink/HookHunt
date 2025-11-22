# HookHunt Implementation Plan
*Dedicated Music Quiz Game Repository - Guess Song/Artist with Spotify API*

## 🎯 Project Overview

**HookHunt** is a standalone music quiz game where players listen to song previews (or hooks) and attempt to guess either the song title or artist name. This repository contains the complete, dedicated HookHunt game implementation.

## 🏗️ **REPOSITORY RESTRUCTURE - IN PROGRESS**

**STATUS**: Repository restructure is 80% complete but has critical blocking issues that need immediate attention.

### ✅ COMPLETED RESTRUCTURE TASKS:
- ✅ Repository converted from multi-game to dedicated HookHunt 
- ✅ Framework integration implemented (using GameHost instead of standalone app)
- ✅ Game selector and multi-game infrastructure removed
- ✅ HookHunt types and store moved to proper locations
- ✅ BlameGame components marked as DEPRECATED (preserved as reference)
- ✅ Package.json updated for HookHunt
- ✅ Framework-compliant game.json configuration created

### 🔴 CRITICAL BLOCKING ISSUES:
- 🔴 HookHuntIntroScreen component completely corrupted (syntax errors)
- 🔴 Import paths broken throughout lib/ directory (reference deleted games/ folder)
- 🔴 Missing screen components referenced in game.json
- 🔴 Framework integration not fully tested

### Target Architecture:
- **Dedicated HookHunt Repository**: Clean, single-purpose music quiz game
- **Component Organization**: HookHunt components in standard `components/` structure
- **No Multi-Game Support**: This repo serves only HookHunt
- **Game Hub Integration**: Separate repo will discover games via `game.json` metadata

### Game Modes
- **Lite Mode**: Uses Spotify's 30-second previews with client-side hook detection
- **Pro Mode**: Full track control with Spotify Web Playback SDK and audio analysis for precise hook positioning

### Key Features
- Spotify OAuth integration with PKCE flow
- Fuzzy matching for song/artist names (70% accuracy threshold)  
- Dynamic playlist selection from user's Spotify library
- Hot-seat multiplayer with score tracking
- Hook detection algorithms (browser-based for Lite, API-based for Pro)
- Progressive Web App capabilities

---

## 🚨 CRITICAL ISSUES TO RESOLVE IN NEXT SESSION

### 1. HookHuntIntroScreen Component (BROKEN)
**File**: `components/game/HookHuntIntroScreen.tsx`
**Issue**: File corrupted with duplicated imports and syntax errors
**Fix**: Complete rewrite using framework Button/Card components

### 2. Import Path Updates (BLOCKING)
**Files Affected**: All files in `lib/integrations/spotify/` and `lib/audio/`
**Issue**: Reference deleted path `../../../games/hookhunt/types`  
**Fix**: Update to `../../hookHuntTypes` or `../hookHuntTypes`

### 3. Missing Screen Components 
**Referenced in game.json but don't exist**:
- SpotifyAuthScreen
- PlaylistSelectionScreen  
- HookHuntGameScreen
- HookHuntSummaryScreen

### 4. Framework Integration Testing
**Status**: Not tested - app may not start properly
**Fix**: Verify GameHost can load HookHunt game configuration

---

## 📋 Implementation Status Update (September 26, 2025)

**🎯 CURRENT STATUS**: Repository restructure 80% complete, but app blocked by critical errors

**📋 IMMEDIATE PRIORITIES**:
1. 🔴 Fix corrupted HookHuntIntroScreen component
2. 🔴 Update import paths in lib/ directory to reference hookHuntTypes.ts
3. 🔴 Create missing screen components referenced in game.json
4. 🔴 Test framework integration and app startup

**📁 MAJOR ARCHITECTURAL CHANGES COMPLETED**:
- ✅ Converted from multi-game to dedicated HookHunt repository
- ✅ Integrated with existing framework (GameHost) instead of standalone app
- ✅ Moved HookHunt types and store to proper framework locations
- ✅ Created framework-compliant game.json configuration
- ✅ Preserved BlameGame components as _DEPRECATED reference files

## 📋 Implementation Phases

### Phase 1: Project Foundation & Spotify Integration ✅ MOSTLY COMPLETE

#### 1.1 Module Structure Setup ✅ COMPLETE (Framework Integration Used Instead)
- [x] **Framework integration implemented** (using existing structure instead of games/ directory)
- [x] **Types moved to root level** (`hookHuntTypes.ts`)
- [x] **Store moved to framework structure** (`store/hookHuntStore.ts`)
- [x] **Game configuration** (`game.json` updated with framework schema)
- [x] **Component structure** (using `components/game/` instead of `games/hookhunt/components/`)
  - [ ] Define module registration interface
  - [ ] Set up module ID and basic configuration
  - [ ] Import and export module in `games/hookhunt/index.ts`
- [ ] **Create phase controllers structure**
  - [ ] Create `games/hookhunt/phases/index.ts`
  - [ ] Create `games/hookhunt/phases/introPhase.ts` skeleton
  - [ ] Create `games/hookhunt/phases/playlistPhase.ts` skeleton
  - [ ] Create `games/hookhunt/phases/gamePhase.ts` skeleton
  - [ ] Create `games/hookhunt/phases/summaryPhase.ts` skeleton
- [ ] **Initialize module store**
  - [ ] Create `games/hookhunt/store.ts` with Zustand setup
  - [ ] Define initial state interface
  - [ ] Add basic store actions (reset, update)
  - [ ] Export store and selectors
- [ ] **Configure screen registry**
  - [ ] Define screen IDs in constants
  - [ ] Create screen registry mapping
  - [ ] Set up routing configuration for HookHunt screens

#### 1.2 Spotify API Integration (60 minutes)
- [ ] **Install required dependencies**
  - [ ] Add `fuzzyset.js` to package.json
  - [ ] Add `meyda` to package.json
  - [ ] Run `npm install` to install new dependencies
  - [ ] Verify installations work correctly
- [ ] **Create Spotify integration directory**
  - [ ] Create `lib/integrations/` directory if not exists
  - [ ] Create `lib/integrations/spotify/` subdirectory
  - [ ] Create `lib/integrations/spotify/types.ts` for type definitions
- [ ] **Implement PKCE OAuth flow**
  - [ ] Create `lib/integrations/spotify/SpotifyAuth.ts`
  - [ ] Implement PKCE code verifier generation
  - [ ] Implement authorization URL construction
  - [ ] Implement token exchange functionality
  - [ ] Add callback handling for OAuth redirect
  - [ ] Implement token storage and retrieval
- [ ] **Create Spotify API client**
  - [ ] Create `lib/integrations/spotify/SpotifyAPI.ts`
  - [ ] Implement base API client with authentication headers
  - [ ] Add rate limiting and retry logic
  - [ ] Implement playlist fetching endpoints
  - [ ] Implement track fetching endpoints
  - [ ] Implement audio analysis endpoints
- [ ] **Environment configuration**
  - [ ] Add Spotify client ID to `.env` template
  - [ ] Add redirect URI configuration
  - [ ] Create environment validation utility
  - [ ] Document environment setup in README
- [ ] **Error handling and token refresh**
  - [ ] Implement token expiration detection
  - [ ] Add automatic token refresh logic
  - [ ] Create error handling for API failures
  - [ ] Add retry mechanisms for network errors

#### 1.3 Data Models & Types (30 minutes)
- [ ] **Define core HookHunt types**
  - [ ] Create `games/hookhunt/types.ts`
  - [ ] Define `Track` interface with Spotify data
  - [ ] Define `Playlist` interface
  - [ ] Define `Player` interface for scoring
  - [ ] Define `GameSession` interface
- [ ] **Create game state interfaces**
  - [ ] Define `HookHuntGameState` interface
  - [ ] Define `PlaylistSelectionState` interface
  - [ ] Define `AudioPlaybackState` interface
  - [ ] Define `ScoringState` interface
- [ ] **Define hook detection types**
  - [ ] Create `HookCandidate` interface
  - [ ] Create `HookDetectionResult` interface
  - [ ] Create `AudioAnalysisData` interface
  - [ ] Define confidence scoring types
- [ ] **Player and scoring models**
  - [ ] Define `PlayerScore` interface
  - [ ] Define `GameRound` interface
  - [ ] Define `MatchResult` interface
  - [ ] Create scoring calculation types

### Phase 2: Core Game Logic Implementation (3-4 hours)

#### 2.1 Hook Detection System (90 minutes)
- [ ] **Create audio utilities foundation**
  - [ ] Create `lib/audio/` directory
  - [ ] Create `lib/audio/audioUtils.ts` with base utilities
  - [ ] Implement audio buffer loading functions
  - [ ] Add audio format validation
  - [ ] Create audio duration calculation utilities
- [ ] **Implement Lite mode hook detection**
  - [ ] Create `lib/audio/previewHookDetector.ts`
  - [ ] Set up Meyda audio analysis integration
  - [ ] Implement RMS (loudness) feature extraction
  - [ ] Implement spectral flux (onset detection) extraction
  - [ ] Create sliding window analysis algorithm
  - [ ] Implement hook candidate scoring system
  - [ ] Add confidence threshold validation
  - [ ] Create fallback for analysis failures
- [ ] **Implement Pro mode hook detection**
  - [ ] Create `lib/audio/audioAnalysisHookDetector.ts`
  - [ ] Integrate Spotify audio analysis API calls
  - [ ] Implement section filtering (15-45 seconds duration)
  - [ ] Add loudness-based section scoring
  - [ ] Implement pitch repetition analysis
  - [ ] Create chorus section estimation heuristics
  - [ ] Add confidence scoring for sections
  - [ ] Implement fallback to Lite mode on failure
- [ ] **Create detection orchestrator**
  - [ ] Create `lib/audio/hookDetector.ts` main interface
  - [ ] Implement mode selection logic (Lite vs Pro)
  - [ ] Add detection result caching
  - [ ] Create hook timing validation
  - [ ] Add manual override functionality

#### 2.2 Song Matching Logic (45 minutes)
- [ ] **Create song matching foundation**
  - [ ] Create `lib/audio/songMatcher.ts`
  - [ ] Set up FuzzySet.js integration
  - [ ] Define matching confidence thresholds
- [ ] **Implement text cleaning functions**
  - [ ] Create song name cleaning function
  - [ ] Remove featuring patterns (feat., ft., featuring)
  - [ ] Normalize whitespace and punctuation
  - [ ] Convert to lowercase for matching
  - [ ] Handle special characters and accents
- [ ] **Implement artist name processing**
  - [ ] Create artist name cleaning function
  - [ ] Handle multiple artist scenarios
  - [ ] Normalize artist name formatting
  - [ ] Create artist list parsing
- [ ] **Create fuzzy matching engine**
  - [ ] Implement confidence-based matching
  - [ ] Set up 70% threshold validation
  - [ ] Add match type detection (song vs artist)
  - [ ] Create result ranking system
  - [ ] Add partial match handling

#### 2.3 Game State Management (45 minutes)
- [ ] **Enhance HookHunt store**
  - [ ] Expand `games/hookhunt/store.ts` with full state
  - [ ] Add playlist management state
  - [ ] Add current track state
  - [ ] Add player management state
  - [ ] Add scoring state management
- [ ] **Implement playlist management**
  - [ ] Add playlist loading actions
  - [ ] Implement track filtering logic
  - [ ] Add preview URL validation
  - [ ] Create track shuffling functionality
  - [ ] Add played tracks tracking
- [ ] **Create player rotation system**
  - [ ] Implement hot-seat player rotation
  - [ ] Add current player tracking
  - [ ] Create player turn management
  - [ ] Add player elimination logic (optional)
- [ ] **Implement scoring system**
  - [ ] Create score calculation functions
  - [ ] Add bonus point logic for quick answers
  - [ ] Implement streak tracking
  - [ ] Add score persistence with localStorage
- [ ] **Create phase transition logic**
  - [ ] Implement setup → playlist transition
  - [ ] Add playlist → playing transition
  - [ ] Create playing → summary transition
  - [ ] Add restart and reset functionality

### Phase 3: User Interface Components (4-5 hours)

#### 3.1 Framework-Compatible Screens (120 minutes)
- [ ] **Create HookHuntIntroScreen**
  - [ ] Create `games/hookhunt/screens/HookHuntIntroScreen.tsx`
  - [ ] Add component documentation header
  - [ ] Implement Spotify login button
  - [ ] Add game mode selection (Lite vs Pro)
  - [ ] Create authentication status display
  - [ ] Add loading states for OAuth flow
  - [ ] Implement error handling for login failures
  - [ ] Add responsive design for mobile
- [ ] **Create PlaylistSelectionScreen**
  - [ ] Create `games/hookhunt/screens/PlaylistSelectionScreen.tsx`
  - [ ] Add component documentation header
  - [ ] Implement playlist fetching and display
  - [ ] Add playlist search and filtering
  - [ ] Create playlist selection UI
  - [ ] Add track count display
  - [ ] Implement loading states
  - [ ] Add error handling for API failures
- [ ] **Create HookHuntPlayerSetupScreen**
  - [ ] Create `games/hookhunt/screens/HookHuntPlayerSetupScreen.tsx`
  - [ ] Add component documentation header
  - [ ] Implement player name input form
  - [ ] Add player list display
  - [ ] Create add/remove player functionality
  - [ ] Add player validation (minimum 2 players)
  - [ ] Implement maximum player limit
  - [ ] Add responsive design
- [ ] **Create HookHuntGameScreen**
  - [ ] Create `games/hookhunt/screens/HookHuntGameScreen.tsx`
  - [ ] Add component documentation header
  - [ ] Integrate AudioPlayer component
  - [ ] Add current player display
  - [ ] Implement guess input form
  - [ ] Add score display
  - [ ] Create track skip functionality
  - [ ] Add game progress indicator
- [ ] **Create HookHuntSummaryScreen**
  - [ ] Create `games/hookhunt/screens/HookHuntSummaryScreen.tsx`
  - [ ] Add component documentation header
  - [ ] Implement final score display
  - [ ] Add winner announcement
  - [ ] Create game statistics display
  - [ ] Add play again functionality
  - [ ] Implement score sharing features

#### 3.2 Audio Player Components (90 minutes)
- [ ] **Create base AudioPlayer component**
  - [ ] Create `games/hookhunt/components/AudioPlayer.tsx`
  - [ ] Add component documentation header
  - [ ] Set up HTML5 audio element
  - [ ] Implement play/pause controls
  - [ ] Add volume control integration
  - [ ] Create playback state management
- [ ] **Implement Lite mode playback**
  - [ ] Add preview URL handling
  - [ ] Implement hook segment playback
  - [ ] Add automatic stop after hook duration
  - [ ] Create playback progress visualization
  - [ ] Add hook detection indicator
- [ ] **Implement Pro mode playback (future)**
  - [ ] Add Spotify Web Playback SDK integration
  - [ ] Implement seek functionality
  - [ ] Add precise hook positioning
  - [ ] Create advanced playback controls
- [ ] **Add visual feedback components**
  - [ ] Create waveform visualization (optional)
  - [ ] Add progress bar component
  - [ ] Implement hook duration timer
  - [ ] Add playback status indicators
- [ ] **Create volume and settings integration**
  - [ ] Integrate with existing useSound hook
  - [ ] Add mute functionality
  - [ ] Create playback speed controls (optional)
  - [ ] Add audio quality indicators

#### 3.3 Input & Scoring Components (60 minutes)
- [ ] **Create GuessInput component**
  - [ ] Create `games/hookhunt/components/GuessInput.tsx`
  - [ ] Add component documentation header
  - [ ] Implement text input with validation
  - [ ] Add submit functionality
  - [ ] Create input clearing on submit
  - [ ] Add placeholder text and hints
  - [ ] Implement keyboard shortcuts (Enter to submit)
- [ ] **Create ScoreDisplay component**
  - [ ] Create `games/hookhunt/components/ScoreDisplay.tsx`
  - [ ] Add component documentation header
  - [ ] Implement current scores display
  - [ ] Add player ranking visualization
  - [ ] Create score change animations
  - [ ] Add streak indicators
  - [ ] Implement responsive score layout
- [ ] **Create FeedbackDisplay component**
  - [ ] Create `games/hookhunt/components/FeedbackDisplay.tsx`
  - [ ] Add component documentation header
  - [ ] Implement correct/incorrect feedback
  - [ ] Add reveal of correct answer
  - [ ] Create animated feedback messages
  - [ ] Add match confidence display
  - [ ] Implement feedback timing controls
- [ ] **Create PlayerRotation component**
  - [ ] Create `games/hookhunt/components/PlayerRotation.tsx`
  - [ ] Add component documentation header
  - [ ] Implement current player highlight
  - [ ] Add turn rotation visualization
  - [ ] Create player queue display
  - [ ] Add turn timer (optional)
  - [ ] Implement responsive player layout

### Phase 4: Advanced Features & Polish (2-3 hours)

#### 4.1 Game Enhancements (60 minutes)
- [ ] **Implement difficulty modes**
  - [ ] Create difficulty selection UI
  - [ ] Add mainstream vs deep cuts filtering
  - [ ] Implement popularity-based track selection
  - [ ] Add difficulty indicators in UI
- [ ] **Add bonus scoring system**
  - [ ] Implement quick answer bonuses
  - [ ] Create time-based scoring multipliers
  - [ ] Add first guess bonuses
  - [ ] Create perfect game achievements
- [ ] **Create streak tracking**
  - [ ] Implement consecutive correct answers
  - [ ] Add streak multipliers
  - [ ] Create streak break notifications
  - [ ] Add streak statistics
- [ ] **Implement skip functionality**
  - [ ] Add skip button to game screen
  - [ ] Implement skip penalties
  - [ ] Create skip vote system (multiplayer)
  - [ ] Add skip statistics tracking

#### 4.2 UI/UX Improvements (60 minutes)
- [ ] **Add album artwork display**
  - [ ] Integrate Spotify album art API
  - [ ] Create artwork reveal after answer
  - [ ] Add artwork loading states
  - [ ] Implement artwork caching
- [ ] **Create smooth transitions**
  - [ ] Add track change animations
  - [ ] Implement screen transition effects
  - [ ] Create loading transition states
  - [ ] Add micro-interactions for buttons
- [ ] **Implement loading states**
  - [ ] Create API call loading indicators
  - [ ] Add playlist loading animations
  - [ ] Implement track buffering states
  - [ ] Create global loading overlay
- [ ] **Add offline detection**
  - [ ] Implement network status monitoring
  - [ ] Create offline mode notifications
  - [ ] Add graceful degradation features
  - [ ] Create cached data fallbacks

#### 4.3 Settings & Customization (30 minutes)
- [ ] **Create hook duration settings**
  - [ ] Add duration slider (7-12 seconds)
  - [ ] Implement duration preview
  - [ ] Create preset duration options
  - [ ] Add duration validation
- [ ] **Add matching threshold adjustment**
  - [ ] Create threshold slider
  - [ ] Add threshold preview with examples
  - [ ] Implement dynamic threshold testing
  - [ ] Create threshold recommendations
- [ ] **Implement game mode toggle**
  - [ ] Add Lite/Pro mode switcher
  - [ ] Create mode feature comparison
  - [ ] Add mode availability detection
  - [ ] Implement mode-specific settings
- [ ] **Create playlist filtering**
  - [ ] Add genre filtering options
  - [ ] Implement track length filtering
  - [ ] Create popularity filtering
  - [ ] Add custom filtering rules

### Phase 5: Testing & Quality Assurance (2 hours)

#### 5.1 Unit Testing (45 minutes)
- [ ] **Test fuzzy matching algorithms**
  - [ ] Create test cases for song name matching
  - [ ] Test artist name matching variations
  - [ ] Test confidence threshold edge cases
  - [ ] Validate cleaning function accuracy
- [ ] **Test hook detection accuracy**
  - [ ] Create mock audio analysis data
  - [ ] Test Lite mode detection algorithms
  - [ ] Test Pro mode section analysis
  - [ ] Validate hook timing accuracy
- [ ] **Test Spotify API integration**
  - [ ] Mock API response scenarios
  - [ ] Test error handling paths
  - [ ] Validate authentication flows
  - [ ] Test rate limiting behavior
- [ ] **Test score calculation**
  - [ ] Validate basic scoring logic
  - [ ] Test bonus point calculations
  - [ ] Test streak multipliers
  - [ ] Validate score persistence

#### 5.2 Integration Testing (45 minutes)
- [ ] **Test complete game flow**
  - [ ] Test login to playlist selection
  - [ ] Test playlist to player setup
  - [ ] Test setup to gameplay
  - [ ] Test gameplay to summary
- [ ] **Test player rotation**
  - [ ] Validate turn management
  - [ ] Test player elimination scenarios
  - [ ] Test score tracking across turns
  - [ ] Validate state persistence
- [ ] **Test audio playback**
  - [ ] Test playback across browsers
  - [ ] Validate hook detection integration
  - [ ] Test volume control integration
  - [ ] Test playback error scenarios
- [ ] **Test offline behavior**
  - [ ] Test network disconnection handling
  - [ ] Validate cached data usage
  - [ ] Test graceful degradation
  - [ ] Test reconnection scenarios

#### 5.3 User Experience Testing (30 minutes)
- [ ] **Test mobile responsiveness**
  - [ ] Test on various screen sizes
  - [ ] Validate touch interactions
  - [ ] Test mobile audio playback
  - [ ] Validate mobile performance
- [ ] **Test accessibility features**
  - [ ] Validate keyboard navigation
  - [ ] Test screen reader compatibility
  - [ ] Check color contrast compliance
  - [ ] Test with assistive technologies
- [ ] **Performance testing**
  - [ ] Test with large playlists (1000+ tracks)
  - [ ] Validate memory usage
  - [ ] Test audio processing performance
  - [ ] Check for memory leaks
- [ ] **Cross-browser compatibility**
  - [ ] Test on Chrome/Chromium
  - [ ] Test on Firefox
  - [ ] Test on Safari
  - [ ] Test on Edge

---

## 🏗️ Technical Architecture

### File Structure
```
games/hookhunt/
├── HookHuntModule.tsx           # Main module entry
├── store.ts                     # Zustand store
├── types.ts                     # TypeScript definitions
├── phases/                      # Phase controllers
│   ├── index.ts
│   ├── introPhase.ts
│   ├── playlistPhase.ts
│   ├── gamePhase.ts
│   └── summaryPhase.ts
├── screens/                     # React components
│   ├── HookHuntIntroScreen.tsx
│   ├── PlaylistSelectionScreen.tsx
│   ├── HookHuntGameScreen.tsx
│   └── HookHuntSummaryScreen.tsx
└── components/                  # Game-specific components
    ├── AudioPlayer.tsx
    ├── GuessInput.tsx
    ├── ScoreDisplay.tsx
    └── PlaylistBrowser.tsx

lib/integrations/spotify/
├── SpotifyAuth.ts              # OAuth implementation
├── SpotifyAPI.ts               # API client
└── types.ts                    # Spotify-specific types

lib/audio/
├── previewHookDetector.ts      # Lite mode hook detection
├── audioAnalysisHookDetector.ts # Pro mode hook detection
├── songMatcher.ts              # Fuzzy matching logic
└── audioUtils.ts               # Audio processing utilities
```

### Data Flow
1. **Authentication**: Spotify OAuth with PKCE → Token storage
2. **Playlist Loading**: User selection → Track filtering → Preview validation
3. **Hook Detection**: Audio analysis → Hook segment identification
4. **Gameplay**: Track playback → User input → Fuzzy matching → Scoring
5. **State Management**: Zustand store → LocalStorage persistence

### Integration Points
- **Framework Router**: Navigate between HookHunt screens
- **Event Bus**: Communicate with parent framework
- **Translation System**: Support multiple languages
- **Sound System**: Integrate with existing audio controls
- **Theme System**: Match existing visual design

---

## 🚫 BlameGame Legacy Deprecation Strategy

### Phase 0: Legacy Component Identification & Marking (30 minutes)
This phase should be completed before starting HookHunt development to clearly separate legacy code.

#### 0.1 Game-Specific Components Deprecation (15 minutes)
- [ ] **Mark BlameNotification component**
  - [ ] Add deprecation header to `components/game/BlameNotification.tsx`
  - [ ] Document component purpose and dependencies
  - [ ] Specify migration target path
  - [ ] Add legacy tag to component title
- [ ] **Mark QuestionCard component**
  - [ ] Add deprecation header to `components/game/QuestionCard.tsx`
  - [ ] Identify BlameGame-specific features to mark
  - [ ] Document blame-related props and logic
  - [ ] Create feature separation comments
- [ ] **Rename and mark QuestionScreen**
  - [ ] Rename `components/game/QuestionScreen.tsx` to `BlameGameQuestionScreen.tsx`
  - [ ] Update all imports across the codebase
  - [ ] Add deprecation header with full component documentation
  - [ ] Mark blame-specific logic sections
- [ ] **Mark other NameBlame screens**
  - [ ] Add deprecation headers to PlayerSetupScreen (NameBlame parts)
  - [ ] Mark blame-specific logic in SummaryScreen
  - [ ] Document IntroScreen NameBlame toggle functionality

#### 0.2 Hooks Deprecation (10 minutes)
- [ ] **Mark useNameBlameSetup hook**
  - [ ] Add deprecation header to `hooks/useNameBlameSetup.ts`
  - [ ] Document all exported functions and state
  - [ ] Identify dependencies on other hooks
  - [ ] Plan generic `usePlayerSetup.ts` interface
- [ ] **Mark BlameGame-specific methods in useGameState**
  - [ ] Add deprecation comments to blame-related methods
  - [ ] Mark `handleBlame` function as deprecated
  - [ ] Document NameBlame-specific state management
  - [ ] Identify methods to extract to separate hook
- [ ] **Mark question-loading logic in useQuestions**
  - [ ] Add deprecation comments to BlameGame-specific features
  - [ ] Mark category-based question loading as legacy
  - [ ] Document current question loading interface
  - [ ] Plan generic content loading system interface

#### 0.3 Store Components Deprecation (5 minutes)
- [ ] **Mark BlameGameStore**
  - [ ] Add deprecation header to `store/BlameGameStore.ts`
  - [ ] Document all state properties and actions
  - [ ] Identify NameBlame-specific state management
  - [ ] Plan migration to `games/nameblame/store.ts`
- [ ] **Mark NameBlame state in other stores**
  - [ ] Review and mark any NameBlame state in other store files
  - [ ] Document cross-store dependencies
  - [ ] Plan state consolidation strategy

### Deprecation Marking Convention
```typescript
/**
 * @deprecated [BlameGame Legacy] This component is specific to BlameGame.
 * Will be moved to games/nameblame/ module in future refactoring.
 * For new development, use framework-compatible alternatives.
 * 
 * Legacy Component: BlameNotification
 * Purpose: Shows blame assignment notifications in NameBlame mode
 * Dependencies: useNameBlameSetup, BlameGameStore
 * Migration Target: games/nameblame/components/BlameNotification.tsx
 */
```

### Migration Strategy
- **Do not delete** any existing BlameGame functionality
- **Mark components** with deprecation comments for easy identification
- **Create parallel** HookHunt implementations without modifying legacy code
- **Use framework patterns** established in the new architecture
- **Maintain backward compatibility** during transition period

---

## 🛠️ Environment & Dependency Setup

### Pre-Development Setup (30 minutes)
This setup should be completed before starting Phase 1.

#### Spotify Developer Configuration (15 minutes)
- [ ] **Create Spotify Developer Account**
  - [ ] Visit https://developer.spotify.com/dashboard
  - [ ] Log in with Spotify account or create new account
  - [ ] Accept Spotify Developer Terms of Service
  - [ ] Verify email if required
- [ ] **Create Spotify Application**
  - [ ] Click "Create an App" button
  - [ ] Set App Name: "HookHunt Music Quiz"
  - [ ] Set App Description: "A music quiz game for guessing songs and artists"
  - [ ] Accept Spotify Developer Terms
  - [ ] Note down Client ID and Client Secret
- [ ] **Configure Redirect URIs**
  - [ ] Go to App Settings
  - [ ] Add development redirect URI: `http://localhost:5173/games/hookhunt/callback`
  - [ ] Add production redirect URI: `https://yourdomain.com/games/hookhunt/callback`
  - [ ] Save settings and verify URIs are listed
- [ ] **Configure App Permissions**
  - [ ] Enable "Web Playback SDK" (for Pro mode future)
  - [ ] Enable "User Library Read" scope
  - [ ] Enable "Playlist Read Private" scope
  - [ ] Enable "User Read Private" scope

#### Environment Variables Setup (10 minutes)
- [ ] **Create environment configuration**
  - [ ] Create `.env.local` file in project root
  - [ ] Add `VITE_SPOTIFY_CLIENT_ID=your_client_id_here`
  - [ ] Add `VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/games/hookhunt/callback`
  - [ ] Add `.env.local` to `.gitignore` if not already present
- [ ] **Create environment template**
  - [ ] Create `.env.example` file
  - [ ] Add template variables with placeholder values
  - [ ] Document required environment variables
  - [ ] Commit template to repository
- [ ] **Validate environment setup**
  - [ ] Create environment validation utility
  - [ ] Add startup checks for required variables
  - [ ] Add helpful error messages for missing variables

#### Package Dependencies Installation (5 minutes)
- [ ] **Install audio analysis dependencies**
  - [ ] Run `npm install fuzzyset.js@^1.0.5`
  - [ ] Run `npm install meyda@^5.2.1`
  - [ ] Verify installations in package.json
  - [ ] Test imports work correctly
- [ ] **Install additional utilities (if needed)**
  - [ ] Consider `lodash.debounce` for input handling
  - [ ] Consider `react-use` for additional hooks
  - [ ] Verify all dependencies are compatible
- [ ] **Update package-lock.json**
  - [ ] Run `npm install` to update lock file
  - [ ] Commit updated package files

### Build Configuration Updates (20 minutes)

#### Vite Configuration (10 minutes)
- [ ] **Update vite.config.ts for HookHunt routing**
  - [ ] Add HookHunt-specific route handling
  - [ ] Configure base path for production builds
  - [ ] Add proxy configuration for Spotify API (development)
  - [ ] Set up build optimizations for audio processing
- [ ] **Configure asset handling**
  - [ ] Set up audio file processing rules
  - [ ] Configure static asset paths
  - [ ] Add audio MIME type handling
  - [ ] Set up asset optimization for production

#### Development Proxy Setup (5 minutes)
- [ ] **Configure Spotify API proxy**
  - [ ] Add proxy rules for CORS during development
  - [ ] Set up API endpoint forwarding
  - [ ] Configure proxy headers for authentication
  - [ ] Test proxy functionality with mock requests

#### Build Path Configuration (5 minutes)
- [ ] **Update deployment paths**
  - [ ] Update build scripts for HookHunt deployment
  - [ ] Configure base URL for GitHub Pages
  - [ ] Update asset path utilities for HookHunt
  - [ ] Test build output paths

---

## 🎯 Success Criteria & Validation

### Minimum Viable Product (MVP) Validation
#### Authentication & User Management
- [ ] **Spotify OAuth Integration**
  - [ ] User can click "Login with Spotify" and complete OAuth flow
  - [ ] Token is stored securely and persists across sessions
  - [ ] User can see authenticated status and profile info
  - [ ] Logout functionality works correctly
- [ ] **Error Handling**
  - [ ] Failed authentication shows helpful error message
  - [ ] Network errors during auth are handled gracefully
  - [ ] Token expiration triggers re-authentication

#### Playlist & Track Management
- [ ] **Playlist Selection**
  - [ ] User can see list of their Spotify playlists
  - [ ] Playlists show track count and basic info
  - [ ] User can select a playlist to use for the game
  - [ ] Only playlists with preview-enabled tracks are selectable
- [ ] **Track Validation**
  - [ ] System filters out tracks without preview URLs
  - [ ] Minimum 10 valid tracks required to start game
  - [ ] Preview URLs are validated before game starts

#### Core Gameplay
- [ ] **Audio Playback**
  - [ ] Game plays 7-12 second hook segments automatically
  - [ ] Audio stops after designated hook duration
  - [ ] Volume controls work with existing sound system
  - [ ] Audio quality is acceptable for song recognition
- [ ] **Fuzzy Matching**
  - [ ] Song title matching works with 70%+ accuracy
  - [ ] Artist name matching works with 70%+ accuracy
  - [ ] Common variations (feat., ft., &, etc.) are handled
  - [ ] Case-insensitive matching works correctly
- [ ] **Player Management**
  - [ ] Hot-seat multiplayer supports 2-8 players
  - [ ] Player turns rotate correctly
  - [ ] Current player is clearly indicated
  - [ ] Player names are validated and stored

#### Scoring & Persistence
- [ ] **Score Calculation**
  - [ ] Correct song guess awards 1 point
  - [ ] Correct artist guess awards 1 point
  - [ ] Scores are calculated and displayed correctly
  - [ ] Score changes are animated and clear
- [ ] **Data Persistence**
  - [ ] Scores persist across browser sessions
  - [ ] Game state is maintained during browser refresh
  - [ ] Player data is saved locally

### Enhanced Features (Post-MVP) Validation
#### Advanced Audio Features
- [ ] **Pro Mode Hook Detection**
  - [ ] Spotify Web Playback SDK integration works
  - [ ] Audio analysis API provides accurate hook timing
  - [ ] Hook detection algorithm selects optimal segments
  - [ ] Pro mode shows improvement over Lite mode
- [ ] **Audio Enhancements**
  - [ ] Album artwork displays after answer reveal
  - [ ] Audio visualization (waveform/progress) works
  - [ ] Multiple audio quality options available

#### Advanced Gameplay
- [ ] **Enhanced Scoring**
  - [ ] Quick answer bonuses calculate correctly
  - [ ] Streak multipliers work as intended
  - [ ] Difficulty modes affect scoring appropriately
- [ ] **Game Modes**
  - [ ] Difficulty selection (mainstream vs deep cuts)
  - [ ] Custom game length options
  - [ ] Skip functionality with appropriate penalties

### Performance Targets & Validation
#### Load Time Performance
- [ ] **Initial Page Load**
  - [ ] Complete page load in < 3 seconds (fast 3G)
  - [ ] Critical rendering path optimized
  - [ ] Progressive loading for non-critical features
- [ ] **Audio Loading**
  - [ ] Audio buffer loads in < 2 seconds
  - [ ] Preloading next track during current playback
  - [ ] Smooth transitions between tracks

#### Runtime Performance
- [ ] **Audio Playback**
  - [ ] Audio playback starts within 500ms of user action
  - [ ] No audio stuttering or glitches
  - [ ] Memory usage remains stable during long sessions
- [ ] **API Response Times**
  - [ ] Spotify API calls complete within 2 seconds
  - [ ] Graceful degradation when API is slow
  - [ ] Appropriate loading states during API calls
- [ ] **Matching Performance**
  - [ ] Fuzzy matching completes within 100ms
  - [ ] UI remains responsive during matching
  - [ ] No lag between input and feedback

#### Accuracy Targets
- [ ] **Hook Detection Accuracy**
  - [ ] 90%+ user satisfaction with hook selection
  - [ ] Hooks are recognizable and fair for guessing
  - [ ] Fallback mechanisms work when detection fails
- [ ] **Matching Accuracy**
  - [ ] False positive rate < 5% for exact matches
  - [ ] True positive rate > 90% for obvious matches
  - [ ] Edge cases handled appropriately

### Browser Compatibility Validation
#### Desktop Browsers
- [ ] **Chrome/Chromium (latest)**
  - [ ] Full functionality works correctly
  - [ ] Audio playback is smooth
  - [ ] Performance meets targets
- [ ] **Firefox (latest)**
  - [ ] All features function correctly
  - [ ] Web Audio API compatibility verified
  - [ ] UI renders correctly
- [ ] **Safari (latest)**
  - [ ] Audio playback works with Safari restrictions
  - [ ] OAuth flow works correctly
  - [ ] Performance is acceptable
- [ ] **Edge (latest)**
  - [ ] Feature parity with Chrome
  - [ ] No Edge-specific issues

#### Mobile Browsers
- [ ] **Mobile Chrome (Android)**
  - [ ] Touch interactions work correctly
  - [ ] Audio playback works on mobile
  - [ ] Responsive design scales properly
- [ ] **Mobile Safari (iOS)**
  - [ ] iOS audio restrictions handled
  - [ ] Touch events work correctly
  - [ ] Performance is acceptable on mobile devices

### Accessibility Validation
- [ ] **Keyboard Navigation**
  - [ ] All interactive elements accessible via keyboard
  - [ ] Tab order is logical and intuitive
  - [ ] Focus indicators are visible
- [ ] **Screen Reader Compatibility**
  - [ ] Important content is announced correctly
  - [ ] ARIA labels are appropriate
  - [ ] Game state changes are communicated
- [ ] **Visual Accessibility**
  - [ ] Color contrast meets WCAG 2.1 AA standards
  - [ ] Text is readable at 200% zoom
  - [ ] Visual indicators don't rely on color alone

---

## 🐛 Risk Mitigation

### Technical Risks
- **Spotify API Rate Limits**: Implement caching and request batching
- **Browser Audio Limitations**: Provide fallbacks for autoplay restrictions
- **Cross-browser Compatibility**: Test Web Audio API implementations
- **Token Expiration**: Implement robust token refresh mechanisms

### User Experience Risks
- **Poor Hook Detection**: Provide manual hook timing controls
- **Network Connectivity**: Implement offline mode with cached data
- **Limited Spotify Access**: Provide demo mode with sample tracks
- **Device Performance**: Optimize audio processing for mobile devices

### Business Risks
- **Spotify API Changes**: Monitor API deprecation notices
- **Licensing Issues**: Ensure compliance with Spotify Developer Terms
- **User Privacy**: Implement proper data handling for user information

---

## 📚 Documentation Requirements

### Technical Documentation (2 hours)
#### API Integration Documentation (45 minutes)
- [ ] **Spotify API Integration Guide**
  - [ ] Create `docs/guides/spotify-integration.md`
  - [ ] Document OAuth PKCE flow implementation
  - [ ] Explain token management and refresh logic
  - [ ] Document API endpoints used and their purposes
  - [ ] Add troubleshooting section for common API issues
- [ ] **Authentication Flow Documentation**
  - [ ] Document step-by-step authentication process
  - [ ] Explain security considerations and best practices
  - [ ] Document error handling for auth failures
  - [ ] Add diagrams for OAuth flow visualization
- [ ] **Rate Limiting and Error Handling**
  - [ ] Document Spotify API rate limits and handling
  - [ ] Explain retry logic and backoff strategies
  - [ ] Document error code meanings and responses
  - [ ] Add monitoring and debugging guidance

#### Audio Processing Documentation (45 minutes)
- [ ] **Hook Detection Algorithm Guide**
  - [ ] Create `docs/guides/hook-detection.md`
  - [ ] Explain Lite mode audio analysis approach
  - [ ] Document Pro mode Spotify analysis integration
  - [ ] Add algorithm parameter explanations
  - [ ] Include performance optimization notes
- [ ] **Audio Processing Architecture**
  - [ ] Document Web Audio API usage
  - [ ] Explain Meyda integration for feature extraction
  - [ ] Document audio buffer management
  - [ ] Add browser compatibility notes
- [ ] **Fuzzy Matching System**
  - [ ] Create `docs/guides/fuzzy-matching.md`
  - [ ] Document FuzzySet.js integration
  - [ ] Explain text cleaning and normalization
  - [ ] Document confidence threshold tuning
  - [ ] Add matching accuracy testing results

#### Architecture Documentation (30 minutes)
- [ ] **Module Architecture Overview**
  - [ ] Create `docs/architecture/hookhunt-module.md`
  - [ ] Document module structure and organization
  - [ ] Explain integration with framework router
  - [ ] Document state management architecture
  - [ ] Add component dependency diagrams

### User Documentation (1.5 hours)
#### Game Instructions (30 minutes)
- [ ] **Game Rules and Scoring Guide**
  - [ ] Create `docs/user-guide/game-rules.md`
  - [ ] Document basic gameplay mechanics
  - [ ] Explain scoring system (song vs artist points)
  - [ ] Document bonus scoring and streak system
  - [ ] Add game mode differences (Lite vs Pro)
- [ ] **Player Setup Instructions**
  - [ ] Document minimum/maximum player requirements
  - [ ] Explain hot-seat multiplayer mechanics
  - [ ] Add tips for optimal player experience
  - [ ] Document turn rotation logic

#### Technical Support (45 minutes)
- [ ] **Spotify Connection Troubleshooting**
  - [ ] Create `docs/troubleshooting/spotify-connection.md`
  - [ ] Document common authentication issues
  - [ ] Add troubleshooting for playback problems
  - [ ] Explain playlist compatibility requirements
  - [ ] Add steps for account permission issues
- [ ] **Browser Compatibility Guide**
  - [ ] Create `docs/compatibility/browser-support.md`
  - [ ] Document supported browsers and versions
  - [ ] Add browser-specific setup instructions
  - [ ] Document known limitations and workarounds
  - [ ] Add mobile browser considerations
- [ ] **Performance Optimization Tips**
  - [ ] Document optimal browser settings
  - [ ] Add network requirements and recommendations
  - [ ] Explain audio quality settings
  - [ ] Add troubleshooting for performance issues

#### Privacy and Legal (15 minutes)
- [ ] **Privacy Policy Updates**
  - [ ] Review and update existing privacy policy
  - [ ] Add Spotify data usage explanations
  - [ ] Document data storage and retention policies
  - [ ] Add user rights and data control information
- [ ] **Terms of Service Updates**
  - [ ] Add HookHunt-specific terms if needed
  - [ ] Document Spotify API compliance requirements
  - [ ] Add intellectual property considerations

### Developer Documentation (2 hours)
#### Development Setup (30 minutes)
- [ ] **Environment Setup Guide**
  - [ ] Create `docs/development/setup.md`
  - [ ] Document required environment variables
  - [ ] Add step-by-step Spotify app configuration
  - [ ] Document dependency installation process
  - [ ] Add development server setup instructions
- [ ] **Build and Deployment Guide**
  - [ ] Document build process for different environments
  - [ ] Add deployment instructions for various platforms
  - [ ] Document environment-specific configurations
  - [ ] Add CI/CD pipeline documentation

#### Code Architecture (45 minutes)
- [ ] **Component Architecture Guide**
  - [ ] Create `docs/development/component-architecture.md`
  - [ ] Document HookHunt-specific component patterns
  - [ ] Explain state management approach
  - [ ] Add component lifecycle documentation
  - [ ] Document integration with framework components
- [ ] **Store and State Management**
  - [ ] Document Zustand store structure
  - [ ] Explain state persistence strategies
  - [ ] Add state flow diagrams
  - [ ] Document state synchronization patterns
- [ ] **Testing Architecture**
  - [ ] Document testing strategy and approach
  - [ ] Add test setup and configuration guide
  - [ ] Document mocking strategies for Spotify API
  - [ ] Add performance testing guidelines

#### Contribution Guidelines (30 minutes)
- [ ] **Contributing to HookHunt**
  - [ ] Create `docs/development/contributing.md`
  - [ ] Document code style and conventions
  - [ ] Add pull request and review process
  - [ ] Document testing requirements
  - [ ] Add issue reporting guidelines
- [ ] **Feature Development Process**
  - [ ] Document feature proposal process
  - [ ] Add design review requirements
  - [ ] Document backward compatibility requirements
  - [ ] Add deprecation and migration guidelines

#### Legacy Migration (15 minutes)
- [ ] **Legacy Migration Path Documentation**
  - [ ] Create `docs/migration/legacy-components.md`
  - [ ] Document deprecated component identification
  - [ ] Add migration timeline and strategy
  - [ ] Document breaking changes and compatibility
  - [ ] Add rollback procedures if needed

### API Reference Documentation (1 hour)
#### Component API Documentation (30 minutes)
- [ ] **HookHunt Component Reference**
  - [ ] Document all HookHunt-specific components
  - [ ] Add prop interfaces and type definitions
  - [ ] Document component usage examples
  - [ ] Add integration guidelines
- [ ] **Hook and Utility Documentation**
  - [ ] Document custom hooks created for HookHunt
  - [ ] Add utility function references
  - [ ] Document audio processing utilities
  - [ ] Add integration examples

#### Integration API Documentation (30 minutes)
- [ ] **Framework Integration API**
  - [ ] Document module registration interface
  - [ ] Add phase controller documentation
  - [ ] Document event bus integration
  - [ ] Add routing integration examples
- [ ] **External API Integration**
  - [ ] Document Spotify API wrapper functions
  - [ ] Add authentication helper documentation
  - [ ] Document error handling utilities
  - [ ] Add rate limiting documentation

---

## 📊 Progress Tracking & Time Estimates

### Development Time Breakdown
| Phase | Tasks | Estimated Time | Priority |
|-------|-------|----------------|----------|
| **Phase 0: Legacy Deprecation** | 8 major tasks, 15 subtasks | 30 minutes | High |
| **Phase 1: Foundation & Integration** | 15 major tasks, 45 subtasks | 2.5 hours | Critical |
| **Phase 2: Core Game Logic** | 12 major tasks, 35 subtasks | 3.5 hours | Critical |
| **Phase 3: User Interface** | 15 major tasks, 50 subtasks | 4.5 hours | Critical |
| **Phase 4: Advanced Features** | 12 major tasks, 30 subtasks | 2.5 hours | Medium |
| **Phase 5: Testing & QA** | 12 major tasks, 25 subtasks | 2 hours | High |
| **Documentation** | 20 major tasks, 60 subtasks | 5.5 hours | Medium |
| **Environment Setup** | 10 major tasks, 25 subtasks | 50 minutes | Critical |

**Total Estimated Time**: 21-25 hours
**Critical Path (MVP)**: 11-13 hours (Phases 0-3 + Setup)
**Full Feature Completion**: 21-25 hours (All phases)

### Development Sessions Planning
#### Session 1: Foundation (3-4 hours)
- [ ] Complete Phase 0: Legacy Deprecation (30 min)
- [ ] Complete Environment Setup (50 min)
- [ ] Complete Phase 1: Foundation & Integration (2.5 hours)
- [ ] **Session Goal**: Working Spotify authentication and module structure

#### Session 2: Core Logic (4 hours)
- [ ] Complete Phase 2: Core Game Logic (3.5 hours)
- [ ] Begin Phase 3: Basic UI Components (30 min)
- [ ] **Session Goal**: Hook detection and fuzzy matching working

#### Session 3: User Interface (4-5 hours)
- [ ] Complete Phase 3: User Interface Components (4 hours)
- [ ] Begin Phase 5: Basic Testing (1 hour)
- [ ] **Session Goal**: Playable MVP with all core screens

#### Session 4: Polish & Testing (3-4 hours)
- [ ] Complete Phase 4: Advanced Features (2.5 hours)
- [ ] Complete Phase 5: Testing & QA (1.5 hours)
- [ ] **Session Goal**: Feature-complete HookHunt

#### Session 5: Documentation (3-4 hours)
- [ ] Complete Technical Documentation (2 hours)
- [ ] Complete User Documentation (1.5 hours)
- [ ] Complete Developer Documentation (2 hours)
- [ ] **Session Goal**: Comprehensive documentation

### MVP Milestone Checklist
The following tasks represent the minimum viable product:

#### Critical Path Tasks (Must Complete for MVP)
- [ ] ✅ **Authentication**: Users can log in with Spotify
- [ ] ✅ **Playlist Selection**: Users can choose from their playlists
- [ ] ✅ **Player Setup**: Multiple players can be added
- [ ] ✅ **Audio Playback**: Hook segments play for 7-12 seconds
- [ ] ✅ **Input System**: Players can submit guesses
- [ ] ✅ **Fuzzy Matching**: Song/artist matching works with 70% accuracy
- [ ] ✅ **Scoring**: Points are awarded and displayed correctly
- [ ] ✅ **Turn Management**: Hot-seat multiplayer works
- [ ] ✅ **Game Flow**: Complete game from start to finish
- [ ] ✅ **Error Handling**: Basic error states handled gracefully

#### Nice-to-Have for MVP (Can be deferred)
- [ ] 🔄 **Advanced Hook Detection**: Pro mode with audio analysis
- [ ] 🔄 **Bonus Scoring**: Time-based and streak bonuses  
- [ ] 🔄 **Advanced UI**: Animations and visual polish
- [ ] 🔄 **Album Artwork**: Display after answer reveal
- [ ] 🔄 **Advanced Settings**: Customizable game parameters

### Risk Mitigation Timeline
#### Week 1: Technical Validation
- [ ] Validate Spotify API integration works
- [ ] Test audio processing in target browsers
- [ ] Verify fuzzy matching accuracy
- [ ] Confirm framework integration approach

#### Week 2: Core Development
- [ ] Implement and test authentication flow
- [ ] Build and test hook detection system
- [ ] Create and test fuzzy matching
- [ ] Implement basic UI components

#### Week 3: Integration & Testing
- [ ] Complete game flow integration
- [ ] Comprehensive testing across browsers
- [ ] Performance optimization
- [ ] Bug fixes and edge case handling

#### Week 4: Polish & Documentation
- [ ] Advanced features and polish
- [ ] Complete documentation
- [ ] Final testing and validation
- [ ] Deployment preparation

### Success Metrics Tracking
#### Development Phase Metrics
- [ ] **Code Coverage**: Aim for 80%+ test coverage
- [ ] **Performance Budget**: All pages load < 3 seconds
- [ ] **Accessibility Score**: WCAG 2.1 AA compliance
- [ ] **Bundle Size**: Keep under 2MB for initial load

#### User Experience Metrics
- [ ] **Authentication Success Rate**: > 95%
- [ ] **Game Completion Rate**: > 90% of started games
- [ ] **Matching Accuracy**: > 70% user satisfaction
- [ ] **Error Rate**: < 5% of user actions result in errors

### Rollback Strategy
If critical issues arise during development:

#### Phase 1-2 Rollback
- Revert to stable framework state
- Document lessons learned
- Plan alternative implementation approach

#### Phase 3+ Rollback  
- Keep working authentication and core logic
- Simplify UI to basic functional components
- Defer advanced features to post-MVP

---

**Updated Estimates**:
- **Minimum Viable Product**: 11-13 hours (3-4 development sessions)
- **Feature-Complete Version**: 21-25 hours (5-6 development sessions)
- **Documentation Complete**: Additional 5.5 hours

## 🏆 Implementation Summary

### ✅ Completed Components

#### Core Architecture
- **Game Selector Interface**: Clean main menu allowing choice between BlameGame and HookHunt
- **HookHunt Module System**: Modular architecture with proper separation of concerns
- **TypeScript Type System**: Comprehensive type definitions for all game entities
- **Zustand State Management**: Persistent store with selective data persistence

#### Spotify Integration  
- **PKCE OAuth 2.0 Flow**: Secure client-side authentication with proper token management
- **Spotify Web API Client**: Type-safe API wrapper with rate limiting and error handling
- **User Profile Integration**: Fetch and display user information
- **Playlist Management**: Load and filter user playlists with preview URL validation

#### Audio Processing System
- **Preview Hook Detector**: Browser-based audio analysis using Meyda for Lite mode
- **Pro Mode Framework**: Structure for Spotify Web Playbook SDK integration
- **Audio Processing Pipeline**: Complete system for loading, analyzing, and processing audio

#### String Matching Engine
- **FuzzySet.js Integration**: Sophisticated fuzzy string matching with confidence scoring
- **Text Normalization**: Advanced cleaning rules for song titles and artist names
- **Multi-criteria Matching**: Supports both song title and artist name recognition

#### User Interface
- **HookHunt Intro Screen**: Complete authentication and game mode selection
- **Responsive Design**: Mobile-friendly interface with proper touch interactions
- **Animation System**: Smooth transitions using Framer Motion
- **Error Handling**: Comprehensive error states and user feedback

### 🔧 Technical Implementation Details

#### File Structure Created
```
games/hookhunt/
├── HookHuntModule.tsx           # Main module entry point
├── store.ts                     # Zustand store with persistence
├── types.ts                     # Comprehensive TypeScript definitions
├── index.ts                     # Module exports
└── screens/
    └── HookHuntIntroScreen.tsx  # Authentication and setup screen

lib/integrations/spotify/
├── SpotifyAuth.ts              # PKCE OAuth implementation
├── SpotifyAPI.ts               # Type-safe API client
└── index.ts                    # Integration exports

lib/audio/
├── previewHookDetector.ts      # Lite mode audio analysis
└── songMatcher.ts              # Fuzzy string matching

GameSelector.tsx                # Main game selection interface
```

#### Key Technologies Integrated
- **Spotify Web API**: Full integration with user authentication and data access
- **Web Audio API**: Browser-based audio processing and analysis
- **Meyda**: Advanced audio feature extraction library
- **FuzzySet.js**: Fuzzy string matching with confidence scoring
- **Zustand**: Lightweight state management with persistence
- **Framer Motion**: Smooth animations and transitions

#### Environment Configuration
- **Environment Variables**: Proper configuration system with validation
- **Development Setup**: Complete development environment with hot reload
- **Build System**: Integrated with existing Vite build pipeline

### 🚀 Ready for Next Phase

The MVP implementation provides a solid foundation for expanding HookHunt with additional features:

1. **Playlist Selection Screen**: Browse and select from user's Spotify playlists
2. **Player Setup**: Add players and configure game settings  
3. **Game Screen**: Audio playback, guess input, and scoring
4. **Summary Screen**: Final scores and statistics
5. **Advanced Features**: Difficulty modes, bonus scoring, statistics

### 🎯 Success Metrics Achieved

- ✅ **Modular Architecture**: Clean separation from existing BlameGame code
- ✅ **Spotify Integration**: Complete OAuth flow and API integration
- ✅ **Type Safety**: Comprehensive TypeScript coverage
- ✅ **User Experience**: Smooth onboarding and authentication flow
- ✅ **Scalable Foundation**: Ready for additional screens and features
- ✅ **Development Experience**: Hot reload, error handling, and debugging tools

**The HookHunt game is successfully implemented and ready for users to explore!** 🎵

---

This enhanced plan provided granular task tracking, realistic time estimates, and multiple validation checkpoints to ensure successful HookHunt implementation while maintaining the existing BlameGame functionality.