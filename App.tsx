import React, { useState, useEffect, useRef } from 'react';
import { GamePhase, GameState, Category } from './types';
import { CATEGORIES } from './constants';
import Button from './components/Button';
import { 
  Users, UserPlus, RefreshCw, ChevronLeft, EyeOff, 
  Shuffle, HelpCircle, Timer, AlertTriangle, CheckCircle, XCircle, Skull,
  Vote, UserCheck, Lock
} from 'lucide-react';

const ROUND_DURATION = 60; // Seconds

const App: React.FC = () => {
  // State
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.SETUP,
    players: ['', '', ''],
    impostorIndex: null,
    selectedCategoryId: null,
    currentWord: null,
    currentRevealIndex: 0,
    isRevealingCard: false,
    votedPlayerIndex: null,
    discussionTimeLeft: ROUND_DURATION,
    votes: {},
    currentVoterIndex: 0,
    isVotingTurn: false,
  });

  const timerRef = useRef<number | null>(null);

  // Timer Logic
  useEffect(() => {
    if (gameState.phase === GamePhase.DISCUSSION && gameState.discussionTimeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => {
          if (prev.discussionTimeLeft <= 1) {
            // Time's up
            if (timerRef.current) clearInterval(timerRef.current);
            return { ...prev, discussionTimeLeft: 0 };
          }
          return { ...prev, discussionTimeLeft: prev.discussionTimeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.phase]);

  // Handlers - Setup
  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...gameState.players];
    newPlayers[index] = name;
    setGameState(prev => ({ ...prev, players: newPlayers }));
  };

  const addPlayer = () => {
    setGameState(prev => ({ ...prev, players: [...prev.players, ''] }));
  };

  const removePlayer = (index: number) => {
    if (gameState.players.length <= 3) return;
    const newPlayers = gameState.players.filter((_, i) => i !== index);
    setGameState(prev => ({ ...prev, players: newPlayers }));
  };

  const finishSetup = () => {
    const validPlayers = gameState.players
      .map(p => p.trim())
      .filter(p => p.length > 0);
    
    if (validPlayers.length < 3) {
      alert("Se necesitan al menos 3 jugadores para comenzar.");
      return;
    }

    setGameState(prev => ({
      ...prev,
      players: validPlayers,
      phase: GamePhase.CATEGORY_SELECT
    }));
  };

  // Handlers - Game Flow
  const selectCategory = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;
    startRound(category, gameState.players);
  };

  const startRound = (category: Category, players: string[]) => {
    const randomWord = category.words[Math.floor(Math.random() * category.words.length)];
    const randomImpostor = Math.floor(Math.random() * players.length);

    setGameState(prev => ({
      ...prev,
      selectedCategoryId: category.id,
      currentWord: randomWord,
      impostorIndex: randomImpostor,
      currentRevealIndex: 0,
      isRevealingCard: false,
      phase: GamePhase.REVEAL,
      discussionTimeLeft: ROUND_DURATION,
      votedPlayerIndex: null,
      votes: {},
      currentVoterIndex: 0,
      isVotingTurn: false
    }));
  };

  const toggleRevealCard = () => {
    setGameState(prev => ({ ...prev, isRevealingCard: !prev.isRevealingCard }));
  };

  const nextPlayer = () => {
    if (gameState.currentRevealIndex >= gameState.players.length - 1) {
      setGameState(prev => ({ ...prev, phase: GamePhase.DISCUSSION }));
    } else {
      setGameState(prev => ({ 
        ...prev, 
        currentRevealIndex: prev.currentRevealIndex + 1,
        isRevealingCard: false 
      }));
    }
  };

  const startVoting = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState(prev => ({ 
      ...prev, 
      phase: GamePhase.VOTING,
      currentVoterIndex: 0,
      isVotingTurn: false,
      votes: {}
    }));
  };

  const startPlayerVote = () => {
    setGameState(prev => ({ ...prev, isVotingTurn: true }));
  };

  const registerVote = (suspectIndex: number) => {
    setGameState(prev => {
      const newVotes = { ...prev.votes, [prev.currentVoterIndex]: suspectIndex };
      
      // If this was the last player
      if (prev.currentVoterIndex >= prev.players.length - 1) {
        // Tally votes logic
        const voteCounts: Record<number, number> = {};
        Object.values(newVotes).forEach((v) => {
          const vote = v as number;
          voteCounts[vote] = (voteCounts[vote] || 0) + 1;
        });

        let maxVotes = 0;
        let candidates: number[] = [];

        Object.entries(voteCounts).forEach(([candidateIndexStr, count]) => {
          const candidateIndex = parseInt(candidateIndexStr);
          if (count > maxVotes) {
            maxVotes = count;
            candidates = [candidateIndex];
          } else if (count === maxVotes) {
            candidates.push(candidateIndex);
          }
        });

        // Determine result: -1 if tie or skip wins
        let finalVotedIndex = -1;
        if (candidates.length === 1) {
          finalVotedIndex = candidates[0];
        } else {
          // Tie implies no one ejected
          finalVotedIndex = -1;
        }

        return {
          ...prev,
          votes: newVotes,
          votedPlayerIndex: finalVotedIndex,
          phase: GamePhase.RESULT
        };
      }

      // Next player
      return {
        ...prev,
        votes: newVotes,
        currentVoterIndex: prev.currentVoterIndex + 1,
        isVotingTurn: false
      };
    });
  };

  const restartSameCategory = () => {
    if (!gameState.selectedCategoryId) return;
    const category = CATEGORIES.find(c => c.id === gameState.selectedCategoryId);
    if (category) {
      startRound(category, gameState.players);
    }
  };

  const changeCategory = () => {
    setGameState(prev => ({ ...prev, phase: GamePhase.CATEGORY_SELECT }));
  };

  const fullReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState({
      phase: GamePhase.SETUP,
      players: gameState.players,
      impostorIndex: null,
      selectedCategoryId: null,
      currentWord: null,
      currentRevealIndex: 0,
      isRevealingCard: false,
      votedPlayerIndex: null,
      discussionTimeLeft: ROUND_DURATION,
      votes: {},
      currentVoterIndex: 0,
      isVotingTurn: false
    });
  };

  // --- RENDERERS ---

  const renderSetup = () => (
    <div className="max-w-md mx-auto w-full p-6 animate-fade-in flex flex-col h-full justify-center">
      <div className="text-center mb-8">
        <div className="inline-block p-3 rounded-full bg-indigo-500/20 mb-4 backdrop-blur-sm border border-indigo-500/30">
          <Skull className="w-10 h-10 text-indigo-300" />
        </div>
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-white to-purple-200 mb-2 tracking-tight drop-shadow-lg">
          EL IMPOSTOR
        </h1>
        <p className="text-indigo-300 font-medium tracking-wide">Edición Chile 🇨🇱</p>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Jugadores
          </h2>
          <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-indigo-500/20">
            {gameState.players.length}
          </span>
        </div>
        
        <div className="space-y-3 max-h-[40vh] overflow-y-auto no-scrollbar pr-1">
          {gameState.players.map((player, index) => (
            <div key={index} className="flex gap-2 animate-slide-up relative group" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-xs pointer-events-none">
                {index + 1}
              </div>
              <input
                type="text"
                placeholder={`Nombre del Jugador`}
                value={player}
                onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                className="flex-1 bg-slate-900/60 border border-slate-700 rounded-xl px-4 pl-8 py-4 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white font-medium placeholder-gray-600"
              />
              {gameState.players.length > 3 && (
                <button 
                  onClick={() => removePlayer(index)}
                  className="w-12 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-colors border border-transparent hover:border-red-500/30"
                  aria-label="Eliminar jugador"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button 
          onClick={addPlayer}
          className="mt-4 w-full py-4 border-2 border-dashed border-slate-600 text-slate-400 rounded-xl font-bold hover:bg-slate-800 hover:border-indigo-500/50 hover:text-indigo-300 transition-all flex items-center justify-center gap-2 group"
        >
          <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform" /> Agregar Jugador
        </button>
      </div>

      <Button onClick={finishSetup} fullWidth className="shadow-xl shadow-indigo-900/50">
        Comenzar Aventura
      </Button>
    </div>
  );

  const renderCategorySelect = () => (
    <div className="max-w-xl mx-auto w-full p-4 flex flex-col h-screen max-h-screen">
      <div className="flex items-center justify-between mb-8 pt-4">
        <button onClick={fullReset} className="p-3 text-slate-400 hover:text-white bg-slate-800/50 rounded-xl hover:bg-slate-700 transition-colors backdrop-blur-sm">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-white tracking-wide">Elige Misión</h2>
        <div className="w-12"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-4 px-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => selectCategory(cat.id)}
            className={`${cat.color} group relative p-6 rounded-3xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 flex flex-col items-center justify-center aspect-square gap-3 overflow-hidden border border-white/10`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            
            <div className="text-6xl drop-shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-300 filter drop-shadow-lg">{cat.icon}</div>
            <span className="font-bold text-lg text-center leading-tight text-white drop-shadow-md relative z-10">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderReveal = () => {
    const currentPlayerName = gameState.players[gameState.currentRevealIndex];
    const isImpostor = gameState.currentRevealIndex === gameState.impostorIndex;
    const category = CATEGORIES.find(c => c.id === gameState.selectedCategoryId);

    return (
      <div className="max-w-md mx-auto w-full h-screen p-6 flex flex-col justify-between items-center relative overflow-hidden">
        {/* Header Progress */}
        <div className="w-full relative z-20 flex justify-between items-center bg-slate-900/40 backdrop-blur-md p-3 rounded-2xl border border-white/5">
           <span className="text-indigo-300 text-xs font-bold tracking-widest uppercase">
             Jugador {gameState.currentRevealIndex + 1} / {gameState.players.length}
           </span>
           <span className="flex items-center gap-2 text-white text-xs font-bold bg-indigo-600/80 px-3 py-1.5 rounded-full border border-indigo-400/30">
              {category?.icon} {category?.name}
           </span>
        </div>

        {/* Main Card Area */}
        <div className="relative z-10 w-full flex-1 flex flex-col justify-center items-center my-8 perspective-1000">
          {!gameState.isRevealingCard ? (
             <div className="text-center animate-fade-in w-full">
               <div className="w-28 h-28 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30 border-4 border-indigo-400/20 ring-4 ring-indigo-900/50">
                  <span className="text-5xl font-black text-white">
                    {currentPlayerName.charAt(0).toUpperCase()}
                  </span>
               </div>
               
               <div className="space-y-2 mb-10">
                 <h3 className="text-indigo-300 text-lg uppercase tracking-widest font-semibold">Turno de</h3>
                 <h1 className="text-5xl font-black text-white tracking-tight drop-shadow-xl">{currentPlayerName}</h1>
               </div>
               
               <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 max-w-xs mx-auto backdrop-blur-sm">
                 <p className="text-red-200 text-sm font-medium flex items-center justify-center gap-2">
                   <EyeOff className="w-4 h-4" />
                   ¡Mantén la pantalla oculta!
                 </p>
               </div>

               <Button onClick={toggleRevealCard} variant="glass" fullWidth className="bg-white/10 hover:bg-white/20">
                  Revelar Identidad
               </Button>
             </div>
          ) : (
            <div className="w-full max-w-sm aspect-[3/4] rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center animate-flip-in relative overflow-hidden border-4 border-white/10 bg-slate-800">
               {isImpostor ? (
                 <>
                   <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-slate-900"></div>
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                   
                   <div className="relative z-10 flex flex-col items-center h-full justify-center">
                      <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-900/50 animate-pulse">
                        <Skull className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-4 drop-shadow-lg">Impostor</h2>
                      
                      <div className="bg-black/30 backdrop-blur-md rounded-xl p-6 border border-white/10">
                        <p className="text-red-200 font-medium text-lg leading-relaxed">
                          Tu misión es engañar a todos. No conoces la palabra secreta.
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-8 opacity-75">
                         <span className="text-xs uppercase tracking-[0.2em] text-red-400 font-bold">Objetivo</span>
                         <p className="text-white text-sm mt-1">Sobrevive a la votación</p>
                      </div>
                   </div>
                 </>
               ) : (
                 <>
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-800"></div>
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                   
                   <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                      <span className="text-indigo-200 text-xs font-bold uppercase tracking-[0.2em] mb-8 bg-black/20 px-4 py-1 rounded-full">Palabra Secreta</span>
                      
                      <div className="w-full bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-inner">
                        <h2 className="text-3xl font-black text-white leading-tight break-words drop-shadow-xl">
                          {gameState.currentWord}
                        </h2>
                      </div>
                      
                      <div className="mt-8 flex flex-col items-center">
                        <div className="w-12 h-1 bg-white/30 rounded-full mb-4"></div>
                        <p className="text-indigo-100 text-sm max-w-[200px]">
                          Mézclate con los demás. Encuentra al impostor.
                        </p>
                      </div>
                   </div>
                 </>
               )}
            </div>
          )}
        </div>

        {/* Footer Controls */}
        {gameState.isRevealingCard && (
          <div className="w-full relative z-20 animate-fade-in-up pb-4">
            <Button onClick={nextPlayer} fullWidth variant="secondary" className="bg-slate-800 border-slate-700 text-slate-300 hover:text-white">
               Ocultar y Siguiente
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderDiscussion = () => {
     const category = CATEGORIES.find(c => c.id === gameState.selectedCategoryId);

     return (
       <div className="max-w-md mx-auto w-full p-6 h-screen flex flex-col justify-between relative">
         <div className="flex-1 flex flex-col items-center justify-center text-center">
            
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
              <div className={`w-40 h-40 rounded-full flex items-center justify-center border-4 ${gameState.discussionTimeLeft <= 10 ? 'border-red-500 bg-red-500/10' : 'border-indigo-500 bg-slate-800'} transition-colors duration-500 relative z-10 shadow-2xl`}>
                 <div className="flex flex-col items-center">
                   <Timer className={`w-8 h-8 mb-1 ${gameState.discussionTimeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-indigo-400'}`} />
                   <span className={`text-5xl font-black tabular-nums ${gameState.discussionTimeLeft <= 10 ? 'text-red-500' : 'text-white'}`}>
                     {gameState.discussionTimeLeft}
                   </span>
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">Segundos</span>
                 </div>
              </div>
            </div>

            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Tiempo de Debate</h1>
            <p className="text-slate-400 mb-8 max-w-xs mx-auto">
              Hagan preguntas y descubran quién miente. Si el tiempo acaba, ¡a votar!
            </p>

            <div className="bg-slate-800/50 backdrop-blur-md border border-white/5 p-4 rounded-2xl w-full mb-6 flex items-center gap-4">
               <div className={`w-12 h-12 rounded-xl ${category?.color} flex items-center justify-center text-2xl text-white shadow-lg`}>
                  {category?.icon}
               </div>
               <div className="text-left">
                  <p className="font-bold text-white text-lg">{category?.name}</p>
                  <p className="text-xs text-slate-400">Tema actual</p>
               </div>
            </div>
         </div>

         <div className="space-y-4 w-full pb-4">
           <Button onClick={startVoting} variant="primary" fullWidth className="animate-pulse-slow">
              <div className="flex items-center justify-center gap-2">
                 <Vote className="w-5 h-5" /> Ir a Votación
              </div>
           </Button>
           
           <Button onClick={fullReset} variant="ghost" className="text-xs text-slate-500 hover:text-slate-300">
              Cancelar Partida
           </Button>
         </div>
       </div>
     );
  };

  const renderVoting = () => {
    const currentVoterName = gameState.players[gameState.currentVoterIndex];

    if (!gameState.isVotingTurn) {
      // Pass phone screen
      return (
        <div className="max-w-md mx-auto w-full p-6 h-screen flex flex-col justify-center items-center text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-indigo-900/50">
              <span className="text-4xl font-bold text-white">{currentVoterName.charAt(0).toUpperCase()}</span>
            </div>
            <h3 className="text-indigo-300 uppercase tracking-widest text-sm font-semibold mb-2">Turno de Votar</h3>
            <h1 className="text-4xl font-black text-white mb-6">{currentVoterName}</h1>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl mb-8 max-w-xs">
            <Lock className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
            <p className="text-slate-300 text-sm">
              Toma el teléfono y asegúrate de que nadie más vea tu voto.
            </p>
          </div>

          <Button onClick={startPlayerVote} fullWidth variant="primary">
            Soy {currentVoterName}, Votar
          </Button>
        </div>
      );
    }

    // Selection screen
    return (
      <div className="max-w-md mx-auto w-full p-6 min-h-screen flex flex-col">
        <div className="text-center mb-8 pt-8">
          <h2 className="text-2xl font-black text-white mb-1">Votación Secreta</h2>
          <p className="text-indigo-200 text-sm">¿Quién crees que es el impostor?</p>
        </div>

        <div className="grid grid-cols-1 gap-3 flex-1 overflow-y-auto pb-4">
          {gameState.players.map((player, index) => {
            // Don't let player vote for themselves (optional rule, but good for UX)
            if (index === gameState.currentVoterIndex) return null;

            return (
              <button
                key={index}
                onClick={() => registerVote(index)}
                className="group relative bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 transition-all p-4 rounded-2xl flex items-center justify-between shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-bold text-indigo-400 border border-slate-700 group-hover:border-indigo-500 group-hover:text-indigo-300 transition-colors">
                    {player.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-lg font-bold text-white text-left">{player}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">VOTAR</span>
                </div>
              </button>
            );
          })}
          
          <button
             onClick={() => registerVote(-1)} // -1 for Skip
             className="mt-4 bg-slate-800/50 border border-dashed border-slate-600 text-slate-400 p-4 rounded-2xl font-bold hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-5 h-5" /> No estoy seguro (Saltar)
          </button>
        </div>
      </div>
    );
  };

  const renderResult = () => {
    const isImpostorFound = gameState.votedPlayerIndex === gameState.impostorIndex;
    const skippedVote = gameState.votedPlayerIndex === -1;
    const impostorName = gameState.players[gameState.impostorIndex!];
    const votedName = !skippedVote && gameState.votedPlayerIndex !== null ? gameState.players[gameState.votedPlayerIndex] : "Nadie";

    // Calculate vote stats for display
    const voteCounts: Record<string, number> = {};
    Object.values(gameState.votes).forEach(voteIndex => {
      const name = voteIndex === -1 ? "Saltar" : gameState.players[voteIndex];
      voteCounts[name] = (voteCounts[name] || 0) + 1;
    });

    let title, subtitle, colorClass, icon;

    if (skippedVote) {
       title = "Nadie expulsado";
       subtitle = "El juego continúa (o gana el impostor)";
       colorClass = "text-yellow-400";
       icon = <HelpCircle className="w-20 h-20 text-yellow-400" />;
    } else if (isImpostorFound) {
       title = "¡VICTORIA!";
       subtitle = "Atraparon al Impostor";
       colorClass = "text-green-400";
       icon = <CheckCircle className="w-20 h-20 text-green-400" />;
    } else {
       title = "DERROTA";
       subtitle = "Expulsaron a un inocente";
       colorClass = "text-red-500";
       icon = <XCircle className="w-20 h-20 text-red-500" />;
    }

    return (
      <div className="max-w-md mx-auto w-full p-6 min-h-screen flex flex-col pt-12 text-center overflow-y-auto">
         <div className="flex-none mb-6 animate-scale-in flex flex-col items-center">
           {icon}
           <h1 className={`text-4xl font-black mt-4 mb-2 uppercase tracking-wide ${colorClass} drop-shadow-lg`}>{title}</h1>
           <p className="text-white text-lg font-medium">{subtitle}</p>
         </div>

         <div className="w-full bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl mb-8 flex-none">
            <div className="mb-6 border-b border-white/10 pb-6">
               <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">El Impostor era</p>
               <p className="text-3xl font-black text-white">{impostorName}</p>
            </div>
            
            <div>
               <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">La palabra secreta era</p>
               <p className="text-2xl font-bold text-indigo-300">{gameState.currentWord}</p>
            </div>
         </div>

         {/* Vote Breakdown */}
         <div className="w-full mb-8 text-left">
            <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3 ml-2">Resultados de Votación</h3>
            <div className="space-y-2">
              {Object.entries(voteCounts)
                .sort(([, a], [, b]) => b - a)
                .map(([name, count]) => (
                <div key={name} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-white/5">
                  <span className="font-bold text-white">{name}</span>
                  <span className="bg-slate-700 text-white text-xs font-bold px-2 py-1 rounded-lg">{count} votos</span>
                </div>
              ))}
            </div>
         </div>

         <div className="w-full grid grid-cols-2 gap-4 flex-none mt-auto">
            <Button onClick={restartSameCategory} variant="primary">
              <div className="flex flex-col items-center">
                 <RefreshCw className="w-5 h-5 mb-1" />
                 <span>Mismo Tema</span>
              </div>
            </Button>
            <Button onClick={changeCategory} variant="secondary">
               <div className="flex flex-col items-center">
                 <Shuffle className="w-5 h-5 mb-1" />
                 <span>Cambiar</span>
              </div>
            </Button>
         </div>
         
         <div className="mt-4 pb-8 flex-none">
            <Button onClick={fullReset} variant="ghost">Nuevo Juego</Button>
         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-slate-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full h-full overflow-y-auto">
        {gameState.phase === GamePhase.SETUP && renderSetup()}
        {gameState.phase === GamePhase.CATEGORY_SELECT && renderCategorySelect()}
        {gameState.phase === GamePhase.REVEAL && renderReveal()}
        {gameState.phase === GamePhase.DISCUSSION && renderDiscussion()}
        {gameState.phase === GamePhase.VOTING && renderVoting()}
        {gameState.phase === GamePhase.RESULT && renderResult()}
      </div>
    </div>
  );
};

export default App;