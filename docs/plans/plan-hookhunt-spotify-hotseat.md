# Plan: HookHunt Spotify + Hot Seat

Goal: Implement a minimal but working flow for HookHunt using Spotify authentication and a local hot-seat mode. Add a distinct cyan/teal/blue palette to differentiate from BlameGame.

## Scope
- Theme: New palette configured in `game.json` and Tailwind safelist for dynamic classes.
- Auth: PKCE OAuth with Spotify using existing integration utils; store user and expiry in the HookHunt store.
- Playlist: Load user playlists and allow choosing one.
- Hot Seat: Reuse setup patterns to add local players and start the game.
- Gameplay: Simple preview + guess screen; 1 point for title, 1 point for artist; advance across tracks.
- Summary: Show final scores and allow restart.

## Files Touched
- `game.json` (theme)
- `tailwind.config.js` (safelist)
- `components/game/SpotifyAuthScreen.tsx` (PKCE + user fetch)
- `components/game/PlaylistSelectionScreen.tsx` (playlist fetch + select)
- `components/game/PlayerSetupScreen.tsx` (hot seat + start game)
- `components/game/HookHuntGameScreen.tsx` (play/guess/score/next)
- `components/game/HookHuntSummaryScreen.tsx` (scores + restart)

## Checklist
- [x] Theme palette switch (cyan/teal/blue)
- [x] Tailwind safelist for dynamic classes
- [x] Spotify auth screen wired to `SpotifyAuth` and `SpotifyAPI`
- [x] Playlist selection hooked to `SpotifyAPI`
- [x] Hot seat setup using HookHunt store
- [x] Gameplay screen with basic 1+1 scoring
- [x] Summary screen with restart
- [x] Complete game flow working end-to-end
- [x] Real audio preview playback in gameplay
- [x] Framework integration with proper routing and actions

## Polish Tasks (Future Enhancement)
- [ ] Polish: i18n keys instead of literals
- [ ] Error states and empty states visual polish
- [ ] Audio fade in/out and better playback handling
- [ ] Enhanced fuzzy matching instead of substring matching
- [ ] Tests: Add e2e flow test from intro → auth → playlist → setup → game → summary
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Loading states and animations
- [ ] Volume controls and audio settings

## Implementation Status: ✅ COMPLETE

All core features have been successfully implemented:
- **Complete Game Flow**: Working intro → auth → playlist → setup → game → summary
- **Real Spotify Integration**: PKCE OAuth with live playlist loading and audio playback
- **Hot Seat Multiplayer**: 2-8 player support with turn-based gameplay and scoring
- **Distinctive Theme**: Cyan/teal/blue palette with Tailwind safelist
- **Framework Integration**: Proper GameHost module registration and routing

## Environment Setup Required
```bash
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:666/
```

## Notes
- **Authentication**: Real PKCE OAuth flow with callback handling and token management
- **Playlist Loading**: Live fetching from user's Spotify playlists with track preview support
- **Scoring System**: 1 point for correct title, 1 point for correct artist (substring matching)
- **Audio Playback**: Uses Spotify's 30-second preview URLs
- **Multiplayer**: Hot seat mode with player turn management and score tracking
- **Ready for Polish**: Core functionality complete, ready for UX enhancements
