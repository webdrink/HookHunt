# Music Quiz MVP Implementierungsplan
*Ähnlich Hitstar - Song/Interpret erraten mit Spotify API*

## 🚀 Quick MVP Setup (30-60 Minuten)

### Phase 1: Projekt Setup (10 Min)

```bash
# 1. Vite React App erstellen
npm create vite@latest music-quiz -- --template react-ts
cd music-quiz
npm install

# 2. TailwindCSS & shadcn/ui Setup
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm i -D @types/node
npx shadcn@latest init

# 3. Zusätzliche Dependencies
npm install fuzzyset.js
npm install lucide-react
```

**tailwind.config.js:**
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

**vite.config.ts:**
```ts
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
})
```

### Phase 2: Spotify OAuth Integration (15 Min)

**src/lib/spotify.ts:**
```ts
const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID'; // Aus Spotify Developer Dashboard
const REDIRECT_URI = window.location.origin + '/callback';
const SCOPES = 'user-read-private playlist-read-private streaming';

export class SpotifyAuth {
  private static readonly AUTH_URL = 'https://accounts.spotify.com/authorize';
  private static readonly API_BASE = 'https://api.spotify.com/v1';

  static login() {
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: CLIENT_ID,
      scope: SCOPES,
      redirect_uri: REDIRECT_URI,
      state: this.generateState()
    });
    
    window.location.href = `${this.AUTH_URL}?${params}`;
  }

  static handleCallback(): string | null {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get('access_token');
    
    if (token) {
      localStorage.setItem('spotify_token', token);
      window.location.hash = ''; // Clean URL
    }
    return token;
  }

  static getToken(): string | null {
    return localStorage.getItem('spotify_token');
  }

  static async apiCall(endpoint: string) {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(`${this.API_BASE}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('API call failed');
    return response.json();
  }

  private static generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
```

### Phase 3: Song Matching Logic (10 Min)

**src/lib/songMatcher.ts:**
```ts
import FuzzySet from 'fuzzyset.js';

export class SongMatcher {
  private static cleanSongName(name: string): string {
    return name
      .replace(/\(feat\..*?\)|\(ft\..*?\)|\(featuring.*?\)/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  private static cleanArtistName(artist: string): string {
    return artist
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  static checkMatch(
    userInput: string, 
    songName: string, 
    artistName: string, 
    threshold: number = 0.7
  ): { type: 'song' | 'artist' | null, confidence: number } {
    const cleanInput = userInput.toLowerCase().trim();
    const cleanSong = this.cleanSongName(songName);
    const cleanArtist = this.cleanArtistName(artistName);

    // FuzzySet für Song-Matching
    const songFuzzy = FuzzySet([cleanSong]);
    const songMatch = songFuzzy.get(cleanInput, null, threshold);

    // FuzzySet für Artist-Matching  
    const artistFuzzy = FuzzySet([cleanArtist]);
    const artistMatch = artistFuzzy.get(cleanInput, null, threshold);

    if (songMatch && songMatch[0]) {
      return { type: 'song', confidence: songMatch[0][0] };
    }
    
    if (artistMatch && artistMatch[0]) {
      return { type: 'artist', confidence: artistMatch[0][0] };
    }

    return { type: null, confidence: 0 };
  }
}
```

### Phase 4: React Komponenten (20 Min)

**src/types/game.ts:**
```ts
export interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  preview_url: string | null;
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentTrack: Track | null;
  playedTracks: string[];
  gameStarted: boolean;
  playlist: Track[];
}
```

**src/components/GameProvider.tsx:**
```tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameState, Player, Track } from '@/types/game';
import { SpotifyAuth } from '@/lib/spotify';
import { SongMatcher } from '@/lib/songMatcher';

const GameContext = createContext<{
  state: GameState;
  actions: {
    addPlayer: (name: string) => void;
    startGame: (playlistId: string) => Promise<void>;
    checkAnswer: (input: string) => { correct: boolean; type: 'song' | 'artist' | null };
    nextPlayer: () => void;
    nextTrack: () => void;
  };
} | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    currentTrack: null,
    playedTracks: [],
    gameStarted: false,
    playlist: []
  });

  const addPlayer = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      players: [...prev.players, { id: Date.now().toString(), name, score: 0 }]
    }));
  }, []);

  const startGame = useCallback(async (playlistId: string) => {
    try {
      const response = await SpotifyAuth.apiCall(`/playlists/${playlistId}/tracks`);
      const tracks = response.items
        .map((item: any) => item.track)
        .filter((track: any) => track.preview_url); // Nur Tracks mit Preview

      setState(prev => ({
        ...prev,
        playlist: tracks,
        gameStarted: true,
        currentTrack: tracks[0] || null
      }));
    } catch (error) {
      console.error('Failed to load playlist:', error);
    }
  }, []);

  const checkAnswer = useCallback((input: string) => {
    if (!state.currentTrack) return { correct: false, type: null };

    const artistNames = state.currentTrack.artists.map(a => a.name).join(', ');
    const match = SongMatcher.checkMatch(input, state.currentTrack.name, artistNames);

    if (match.type) {
      // Punkt vergeben
      setState(prev => {
        const newPlayers = [...prev.players];
        newPlayers[prev.currentPlayerIndex].score += 1;
        return { ...prev, players: newPlayers };
      });
      
      // Score in localStorage speichern
      const currentPlayer = state.players[state.currentPlayerIndex];
      localStorage.setItem(`score_${currentPlayer.id}`, currentPlayer.score.toString());
    }

    return { correct: match.type !== null, type: match.type };
  }, [state.currentTrack, state.currentPlayerIndex, state.players]);

  const nextPlayer = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length
    }));
  }, []);

  const nextTrack = useCallback(() => {
    setState(prev => {
      const unusedTracks = prev.playlist.filter(t => !prev.playedTracks.includes(t.id));
      const nextTrack = unusedTracks[Math.floor(Math.random() * unusedTracks.length)];
      
      return {
        ...prev,
        currentTrack: nextTrack || null,
        playedTracks: prev.currentTrack ? [...prev.playedTracks, prev.currentTrack.id] : prev.playedTracks
      };
    });
  }, []);

  return (
    <GameContext.Provider value={{
      state,
      actions: { addPlayer, startGame, checkAnswer, nextPlayer, nextTrack }
    }}>
      {children}
    </GameContext.Provider>
  );
};
```

### Phase 5: UI Komponenten (15 Min)

**src/components/ui/button.tsx:** (via shadcn)
```bash
npx shadcn@latest add button card input
```

**src/components/PlayerSetup.tsx:**
```tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from './GameProvider';

export const PlayerSetup: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [playerName, setPlayerName] = useState('');
  const { state, actions } = useGame();

  const handleAddPlayer = () => {
    if (playerName.trim()) {
      actions.addPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Spieler hinzufügen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Spielername eingeben"
            onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
          />
          <Button onClick={handleAddPlayer}>+</Button>
        </div>
        
        <div className="space-y-2">
          {state.players.map(player => (
            <div key={player.id} className="p-2 bg-gray-100 rounded">
              {player.name}
            </div>
          ))}
        </div>

        {state.players.length >= 1 && (
          <Button onClick={onNext} className="w-full">
            Weiter zur Playlist-Auswahl
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
```

**src/components/PlaylistSelector.tsx:**
```tsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SpotifyAuth } from '@/lib/spotify';
import { useGame } from './GameProvider';

interface Playlist {
  id: string;
  name: string;
  tracks: { total: number };
}

export const PlaylistSelector: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const { actions } = useGame();

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const response = await SpotifyAuth.apiCall('/me/playlists?limit=20');
      setPlaylists(response.items);
    } catch (error) {
      console.error('Failed to load playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectPlaylist = async (playlistId: string) => {
    await actions.startGame(playlistId);
    onNext();
  };

  if (loading) return <div>Lade Playlists...</div>;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Playlist auswählen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-y-auto">
        {playlists.map(playlist => (
          <Button
            key={playlist.id}
            variant="outline"
            className="w-full justify-between"
            onClick={() => selectPlaylist(playlist.id)}
          >
            <span>{playlist.name}</span>
            <span className="text-sm text-gray-500">{playlist.tracks.total} Songs</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
```

**src/components/GamePlay.tsx:**
```tsx
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Pause, SkipForward } from 'lucide-react';
import { useGame } from './GameProvider';

export const GamePlay: React.FC = () => {
  const [input, setInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const { state, actions } = useGame();

  useEffect(() => {
    if (state.currentTrack?.preview_url && audioRef.current) {
      audioRef.current.src = state.currentTrack.preview_url;
      audioRef.current.load();
    }
  }, [state.currentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    const result = actions.checkAnswer(input);
    if (result.correct) {
      setFeedback(`✅ Richtig! (+1 Punkt für ${result.type === 'song' ? 'Song' : 'Interpret'})`);
    } else {
      setFeedback('❌ Leider falsch');
      actions.nextPlayer(); // Hot-Seat: Nächster Spieler
    }
    
    setInput('');
    setTimeout(() => setFeedback(''), 2000);
  };

  const handleNext = () => {
    actions.nextTrack();
    actions.nextPlayer();
    setIsPlaying(false);
    setFeedback('');
    audioRef.current?.pause();
  };

  const currentPlayer = state.players[state.currentPlayerIndex];

  if (!state.currentTrack) {
    return <div>Keine Songs verfügbar</div>;
  }

  return (
    <div className="space-y-4 w-full max-w-md">
      {/* Spielerinfo & Scores */}
      <Card>
        <CardContent className="pt-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold">{currentPlayer?.name} ist dran</h3>
          </div>
          <div className="flex justify-center gap-4 text-sm">
            {state.players.map(player => (
              <span key={player.id} className={player.id === currentPlayer.id ? 'font-bold' : ''}>
                {player.name}: {player.score}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audio Controls */}
      <Card>
        <CardContent className="pt-4 text-center space-y-4">
          <div className="flex justify-center gap-2">
            <Button onClick={togglePlay} size="lg">
              {isPlaying ? <Pause /> : <Play />}
            </Button>
            <Button onClick={handleNext} variant="outline">
              <SkipForward />
            </Button>
          </div>
          <audio ref={audioRef} />
        </CardContent>
      </Card>

      {/* Eingabe */}
      <Card>
        <CardHeader>
          <CardTitle>Song oder Interpret erraten</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Deine Antwort..."
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <Button onClick={handleSubmit}>OK</Button>
          </div>
          {feedback && (
            <div className="text-center p-2 rounded bg-gray-100">
              {feedback}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
```

### Phase 6: Hauptkomponente (10 Min)

**src/App.tsx:**
```tsx
import React, { useState, useEffect } from 'react';
import { GameProvider } from '@/components/GameProvider';
import { PlayerSetup } from '@/components/PlayerSetup';
import { PlaylistSelector } from '@/components/PlaylistSelector';
import { GamePlay } from '@/components/GamePlay';
import { Button } from '@/components/ui/button';
import { SpotifyAuth } from '@/lib/spotify';

type GameStep = 'login' | 'players' | 'playlist' | 'game';

function App() {
  const [step, setStep] = useState<GameStep>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for callback
    const token = SpotifyAuth.handleCallback();
    if (token || SpotifyAuth.getToken()) {
      setIsAuthenticated(true);
      setStep('players');
    }
  }, []);

  const handleLogin = () => {
    SpotifyAuth.login();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Music Quiz</h1>
          <p>Melde dich mit Spotify an, um zu spielen</p>
          <Button onClick={handleLogin} size="lg">
            Mit Spotify anmelden
          </Button>
        </div>
      </div>
    );
  }

  return (
    <GameProvider>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {step === 'players' && (
          <PlayerSetup onNext={() => setStep('playlist')} />
        )}
        {step === 'playlist' && (
          <PlaylistSelector onNext={() => setStep('game')} />
        )}
        {step === 'game' && <GamePlay />}
      </div>
    </GameProvider>
  );
}

export default App;
```

## 🔧 Environment Setup

**Spotify Developer Dashboard:**
1. Gehe zu https://developer.spotify.com/dashboard
2. "Create an App" → Name: "Music Quiz", Description: "Quiz Game"
3. Redirect URIs hinzufügen: `http://localhost:5173/` (für Dev), `https://yourusername.github.io/music-quiz/` (für Prod)
4. Client ID kopieren und in `spotify.ts` einfügen

## 🚀 GitHub Pages Deployment

**package.json** (scripts hinzufügen):
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

```bash
npm install -D gh-pages
npm run deploy
```

## 📝 MVP Features Checklist

- [x] ✅ OAuth Login mit Spotify
- [x] ✅ Playlist-Auswahl aus User-Account  
- [x] ✅ 70% Fuzzy-Match für Song/Interpret
- [x] ✅ Features aus Song-Namen entfernen
- [x] ✅ Hot-Seat Modus (Player-Rotation)
- [x] ✅ Score-Tracking mit LocalStorage
- [x] ✅ Audio-Preview abspielen
- [x] ✅ GitHub Pages ready (statisch)

## 🎯 Erweiterungen für V2

- **Reihenfolge-Bonus:** Zusätzliche Punkte, wenn User Songs in chronologischer Playlist-Reihenfolge errät
- **Timer:** 30s pro Song für mehr Spannung
- **Difficulty Modes:** Easy (Mainstream), Hard (Deep Cuts)
- **Multiplayer:** WebRTC für echte Online-Multiplayer
- **Custom Playlists:** User kann Spotify-URLs eingeben

## 🛠 Debugging Tipps

- **CORS Errors:** Spotify-API ist CORS-ready, aber Domain in Dashboard prüfen
- **No Preview URL:** Nicht alle Songs haben Preview - Filter implementiert
- **Token Expiry:** Nach 60min läuft Token ab - Refresh-Logic für V2
- **Audio Autoplay:** Browser blockiert Autoplay - User-Interaktion nötig

---

**Geschätzte Entwicklungszeit:** 60-90 Minuten für funktionsfähigen MVP
**Deployment:** ~5 Minuten auf GitHub Pages
**Technologie-Lock-ins:** Nur Spotify API (clientseitig aufrufbar)


1) Zwei Betriebsarten
A) HookHunt Lite (ohne Premium, nur Preview)

Quelle: track.preview_url (feste 30 s, Start unbekannt).

Idee: Analysiere nur die Preview im Browser und spiele das wahrscheinlichste 7–12-Sekunden-Fenster ab, das „Hook-haft“ wirkt.

Heuristik im Browser:

Lade die Preview in ein AudioBuffer.

Extrahiere Features mit Meyda (JS-Audio-Analyse): RMS (Lautheit), Spectral Flux (Onsets), Chroma (Tonhöhenklassen).

Wähle das Fenster mit:

hoher mittlerer RMS,

hoher Wiederholungsähnlichkeit der Chroma-Vektoren im Fenster (Refrains wiederholen harmonische Muster),

geringer Pitch-Entropie (Hook oft „catchy“ und tonal stabil).

Grenzen: Du findest die Hook der Preview, nicht zwingend die Hook des Songs. Für MVP absolut okay.

B) HookHunt Pro (Premium + volle Kontrolle)

Quelle: Voller Track via Spotify Web Playback SDK.

API: /audio-analysis/{id} liefert sections und segments mit Startzeiten, Dauer, Lautheit, Pitches.

Idee: Schätze die Chorus-Sektion:

Nimm die Section mit

Dauer zwischen 15–45 s,

hoher durchschnittlicher Lautheit,

Start nach ~30 s (Intro/Verse skippen),

optional: interne Wiederholung in segments.pitches (Selbstähnlichkeit).

Spiele dann exakt ab: player.seek(chorusStartMs) und absorbier 7–12 s.

Das ist kein Orakel, aber erstaunlich robust. Und ja, manchmal liegt die Hook bei 0:05. Menschen sind chaotisch, Musik auch.

2) Implementierung (dein Code-Stil, minimalinvasiv)
2.1 Spotify Audio Analysis Wrapper

src/lib/spotify.ts ergänzen:

static async getAudioAnalysis(trackId: string) {
  return this.apiCall(`/audio-analysis/${trackId}`);
}

2.2 Heuristik für Pro-Modus

src/lib/hookDetector.ts

type Section = { start: number; duration: number; loudness: number; confidence: number };
type Segment = { start: number; duration: number; loudness_max: number; pitches: number[]; };

export type HookCandidate = { startMs: number; durationMs: number; score: number };

export function estimateChorusFromAnalysis(analysis: any): HookCandidate | null {
  const sections: Section[] = analysis.sections || [];
  const segments: Segment[] = analysis.segments || [];
  if (!sections.length) return null;

  // 1) Vorauswahl sinnvoller Sections
  const candidates = sections
    .map(s => {
      const dur = s.duration ?? 0;
      const start = s.start ?? 0;
      return { 
        start, 
        dur, 
        loud: s.loudness ?? -60, 
        conf: s.confidence ?? 0 
      };
    })
    .filter(s => s.dur >= 15 && s.dur <= 45)        // typische Chorus-Länge
    .filter(s => s.start >= 20)                     // nicht im Intro
    .slice(0, 8);                                   // Safety

  if (!candidates.length) {
    // Fallback: nimm lauteste Section > 10 s
    const alt = sections
      .map(s => ({ start: s.start, dur: s.duration, loud: s.loudness ?? -60 }))
      .filter(s => s.dur >= 10)
      .sort((a,b) => b.loud - a.loud)[0];
    if (!alt) return null;
    return { startMs: Math.round(alt.start * 1000), durationMs: Math.min(12000, Math.round(alt.dur * 1000)), score: alt.loud };
  }

  // 2) Scoring: Lautheit + interne Wiederholung (Chroma-Approx via segments.pitches)
  function repetitionScore(start: number, dur: number) {
    const end = start + dur;
    const inWin = segments.filter(seg => seg.start >= start && seg.start <= end && seg.pitches);
    if (inWin.length < 4) return 0;

    // sehr einfache Selbstähnlichkeit: mittlere Kosinus-Ähnlichkeit benachbarter pitches
    let sim = 0, count = 0;
    for (let i = 0; i < inWin.length - 1; i++) {
      const a = inWin[i].pitches, b = inWin[i+1].pitches;
      const dot = a.reduce((sum, ai, k) => sum + ai * b[k], 0);
      const na = Math.sqrt(a.reduce((s, ai) => s + ai*ai, 0));
      const nb = Math.sqrt(b.reduce((s, bi) => s + bi*bi, 0));
      const cos = na && nb ? dot / (na * nb) : 0;
      sim += cos; count++;
    }
    return count ? sim / count : 0;
  }

  const scored = candidates.map(c => {
    const rep = repetitionScore(c.start, c.dur);
    const loudNorm = (c.loud + 60) / 60;       // -60..0 dB -> 0..1
    const conf = c.conf ?? 0;
    const score = 0.55 * loudNorm + 0.35 * rep + 0.10 * conf;
    return { ...c, rep, score };
  }).sort((a,b) => b.score - a.score);

  const best = scored[0];
  return { startMs: Math.round(best.start * 1000), durationMs: Math.min(12000, Math.round(best.dur * 1000)), score: best.score };
}

2.3 Lite-Modus: Hook in der Preview finden

Installiere Meyda: npm i meyda
src/lib/previewHook.ts

import Meyda from "meyda";

export async function estimateHookInPreview(previewUrl: string, windowSec = 9): Promise<{offsetSec:number}> {
  // Audio laden
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const resp = await fetch(previewUrl);
  const arr = await resp.arrayBuffer();
  const buf = await ctx.decodeAudioData(arr);

  const hopSize = 1024;
  const sr = buf.sampleRate;
  const ch = buf.getChannelData(0);

  // Sliding window (in Samples)
  const winLen = Math.floor(windowSec * sr);
  const step = Math.floor(0.25 * sr); // 250ms hop

  let bestScore = -Infinity;
  let bestStart = 0;

  for (let start = 0; start + winLen < ch.length; start += step) {
    let rmsSum = 0, fluxSum = 0, frames = 0;

    for (let f = start; f + hopSize < start + winLen; f += hopSize) {
      const frame = ch.slice(f, f + hopSize);
      const feats = Meyda.extract(["rms", "spectralFlux"], frame, { sampleRate: sr, bufferSize: hopSize }) as any;
      if (!feats) continue;
      rmsSum += feats.rms || 0;
      fluxSum += feats.spectralFlux || 0;
      frames++;
    }
    if (!frames) continue;

    const rms = rmsSum / frames;             // Lautheit
    const flux = fluxSum / frames;           // „Bewegung“
    const score = rms * 0.8 + flux * 0.2;    // simple Heuristik

    if (score > bestScore) {
      bestScore = score;
      bestStart = start;
    }
  }

  await ctx.close();
  return { offsetSec: bestStart / sr };
}

2.4 Integration ins Spiel
Pro-Modus: Web Playback SDK + Seek

Lade das SDK, initialisiere Player, hole device_id.

Starte Track auf dem Device, dann player.seek(hook.startMs) und spiele 7–12 s.

Falls keine passende Section: Fallback auf Lite.

Lite-Modus: HTMLAudio + Teilfenster

In GamePlay.tsx ergänzen:

import { estimateHookInPreview } from "@/lib/previewHook";
import { estimateChorusFromAnalysis } from "@/lib/hookDetector";
import { SpotifyAuth } from "@/lib/spotify";

const [hookOffset, setHookOffset] = useState<number>(0);
const HOOK_WINDOW = 9; // Sek.

useEffect(() => {
  (async () => {
    setHookOffset(0);
    if (!state.currentTrack?.preview_url) return;

    // Lite (Preview)
    const { offsetSec } = await estimateHookInPreview(state.currentTrack.preview_url, HOOK_WINDOW);
    setHookOffset(offsetSec);
  })();
}, [state.currentTrack]);

const playHook = async () => {
  if (!audioRef.current || !state.currentTrack?.preview_url) return;
  audioRef.current.src = state.currentTrack.preview_url;
  await audioRef.current.play();
  audioRef.current.currentTime = hookOffset;   // springe in Hook-Fenster
  setIsPlaying(true);

  // Nach Fenster wieder stoppen
  setTimeout(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, HOOK_WINDOW * 1000);
};


Button statt Play/Pause:

<Button onClick={playHook} size="lg">Hook abspielen</Button>

Optional: Pro-Modus Umschalter
const [proMode, setProMode] = useState(false); // UI Toggle

useEffect(() => {
  (async () => {
    if (!state.currentTrack) return;
    if (proMode) {
      const analysis = await SpotifyAuth.getAudioAnalysis(state.currentTrack.id);
      const hook = estimateChorusFromAnalysis(analysis);
      // -> hier Web Playback SDK verwenden: seek(hook.startMs)
    }
  })();
}, [state.currentTrack, proMode]);

3) UX-Regeln, damit es sich „nach Hook“ anfühlt

Fixes Fenster: 7–12 s sind sweet spot. Kürzer wirkt stressig, länger verrät zu viel.

Einblendung: Kein Cover, kein Titel. Nur Timer + „Hook-Modus“ Badge.

Strafen/Bonuspunkte:

+1 Song, +1 Interpret, +1 Bonus wenn beides in <3 s beantwortet wird.

−1, wenn geraten wurde, während Audio pausiert war (Anti-Cheese).

Feedback: Nach Auflösung kurz Cover + korrekter Zeitpunkt (z. B. „Hook bei 01:07“).

4) Risiken, ehrlich serviert

Preview-Unsicherheit: Lite-Modus errät die Hook nur innerhalb der 30 s, die Spotify vorgibt.

Premium-Abhängigkeit: Pro-Modus braucht Premium und die Web Playback SDK-Hölle.

Heuristik-Fehler: Manche Songs haben leise Hooks oder Post-Choruses; die Metriken täuschen.

Rate Limits: /audio-analysis cachen (IndexedDB) und nur einmal pro Track ziehen.

5) Architektur-Sauberkeit

Feature-Flag HOOK_MODE: 'lite' | 'pro'.

Cache-Layer für audio-analysis per localforage.

Kleines Telemetry-Event: „Hook guessed in Xs“, um die Heuristik später mit echten Daten zu tunen.


Wo Anpassungen nötig sind

Spiel‑Flow
BlameGame kennt die Phasen Intro → PlayerSetup → Loading → Playing → Summary
GitHub
. HookHunt braucht stattdessen:

Intro: Login bei Spotify und Auswahl des Modus (Preview vs. Pro).

Playlist‑Auswahl: Der Nutzer wählt eine Playlist oder Eingabe eines Spotify‑Links.

Track‑Laden: Abrufen der Tracks, Filtern nach verfügbaren Previews.

Hook‑Play: Abspielen des Hook‑Segments (siehe deine Hook‑Erkennung) und Fuzzy‑Matching der Eingabe.

Score‑Summary.
Du kannst die vorhandenen Screen‑Wrapper (GameContainer, GameHeader) weiterverwenden, aber musst die Logik in useQuestions durch useTracks ersetzen.

Datennutzung
BlameGame lädt Fragen aus statischen JSONs im public‑Verzeichnis
GitHub
. HookHunt lädt dynamisch von der Spotify‑API. Das bedeutet:

Du brauchst einen OAuth‑Flow (PKCE), Token‑Refresh und API‑Client (lib/spotify.ts).

Dynamische Daten gehören nicht ins public‑Verzeichnis, sondern in Hooks.

Die fetchWithRetry‑Utility kann für API‑Calls mit Rate‑Limit‑Fehlern wiederverwendet werden.

Store‑Struktur
Der aktuelle Store speichert GameInfo (Name, Titel, Beschreibung, Domain, Icon, …)
GitHub
. Für LeagueofFun sollte GameInfo generisch bleiben und pro Spiel befüllt werden (z. B. name: "HookHunt", domain: "hookhunt", tags: ["music","quiz"]). Eine übergeordnete currentGame‑Struktur kann mehrere Spiele registrieren und zwischen ihnen wechseln.

Routing und Build‑Paths
BlameGame wird unter /games/blamegame/ gebaut (siehe SOUND_PATHS
GitHub
). Für HookHunt musst du im Vite‑Config base auf /games/hookhunt/ setzen, die Assets‑Pfad‑Utils anpassen und das Deployment‑Script (scripts/fix-deployment-paths.js) erweitern.

Sound‑Handling
useSound ist für kurze Effekte gedacht. Für HookHunt brauchst du ein eigenes Playback‑Hook, das entweder die Spotify‑Preview via HTMLAudio (Lite‑Modus) oder den Web‑Playback‑SDK (Pro‑Modus) abspielt und ggf. in die Hook‑Position seeked. Du kannst die Lautstärke‑Regler von useSound übernehmen, aber das Timing‑Handling musst du neu schreiben.

Testing & Debugging
BlameGame hat DebugPanel und LanguageTester. Für HookHunt solltest du auch Debug‑Tools vorsehen – z. B. zum Simulieren von Spotify‑API‑Fehlern, zum Testen der Hook‑Erkennung und zum Fuzzy‑Match‑Tuning.