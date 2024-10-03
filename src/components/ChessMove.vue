<template>
  <div class="chessboard">
    <div v-if="allPlayers.length > 0">
      <Players
        :solde="player1.piece ==='black' ? player1?.solde : player2?.solde"
        :player-name="player1.piece ==='black' ? player1?.name : player2?.name"
        :turn="currentPlayer.piece === 'black'"
      />
    </div>
    <!-- Chronomètres en haut -->
    <div
      class="timer"
      :class="{ paused: !topTimerRunning }"
    >
      <span class="digital-clock">{{ formatTime(blackTime) }}</span>
    </div>
    <!-- L'échiquier avec les cellules et pièces -->
    <div class="board">
      <!-- Lettres verticales (A à H) -->
      <div class="letters">
        <div
          v-for="(row, rowIndex) in board"
          :key="rowIndex"
          class="letter"
        >
          {{ String.fromCharCode(65 + rowIndex) }}
        </div>
      </div>

      <div
        v-for="(row, rowIndex) in board"
        :key="rowIndex"
        class="row"
      >
        <!-- Numéros horizontaux (0 à 7) -->
        <div class="number">
          {{ rowIndex }}
        </div>

        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          :class="['cell', getCellColor(rowIndex, colIndex), isSelected(rowIndex, colIndex) ? 'selected' : '']"
          @click="handleCellClick(rowIndex, colIndex)"
        >
          <img
            v-if="cell"
            :src="getPieceImage(cell)"
            :class="imageClass"
            alt="pièces"
          >
        </div>
      </div>
    </div>

    <!-- Chronomètre en bas -->
    <div
      class="timer"
      :class="{ paused: !bottomTimerRunning }"
    >
      <span class="digital-clock">{{ formatTime(whiteTime) }}</span>
    </div>

    <div v-if="allPlayers.length > 0">
      <Players
        :solde="player1.piece ==='white' ? player1?.solde : player2?.solde"
        :player-name="player1.piece ==='white' ? player1?.name : player2?.name"
        :turn="currentPlayer.piece === 'white'"
      />
    </div>

    <div>
      <DialogChessMate
        v-model:open="showDialog"
        :chess-mate="true"
      />
    </div>

    <div>
      <v-dialog
        v-model="dialogPromated"
        max-width="400px"
      >
        <v-card>
          <v-card-title>
            Sélectionnez une promotion
          </v-card-title>
          <v-card-text>
            <div class="promotion-options">
              <v-btn
                v-for="(promotion, index) in promate"
                :key="index"
                class="promotion-btn"
                height="60"
                width="60"
                @click="promotePawn(rowPromoted, colPromoted, promotion.piece); dialogPromated = false"
              >
                <v-img
                  :src="promotion.image"
                  class="promotion-image"
                  alt="logo"
                />
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <audio
      id="whiteCheckAudio"
      :src="audioWchess"
    />
    <audio
      id="blackCheckAudio"
      :src="audioBchess"
    />

    <v-dialog
      v-model="loading"
      max-width="320"
      persistent
    >
      <v-list
        class="py-2"
        color="primary"
        rounded="lg"
      >
        <v-list-item
          prepend-icon="$vuetify-outline"
          title="Chargement de la partie..."
        >
          <template #prepend>
            <div class="pe-4">
              <v-icon
                color="primary"
                size="x-large"
              />
            </div>
          </template>

          <template #append>
            <v-progress-circular
              color="primary"
              indeterminate="disable-shrink"
              size="16"
              width="2"
            />
          </template>
        </v-list-item>
      </v-list>
    </v-dialog>

    <v-dialog
      v-model="timeout"
      max-width="600px"
      persistent
    >
      <v-card>
        <v-card-title>
          La partie est terminer
        </v-card-title>
        <v-card-text>
          <p>Félicitation !</p>
          <p>Vous avez gagner {{ partyStore.party.mise }} Ariary</p>
        </v-card-text>
        <template #actions>
          <v-btn
            flat
            variant="tonal"
            class="me-2 text-none"
            size="small"
            color="success"
            @click="reloadPage();"
          >
            Rejouer
          </v-btn>
          <v-spacer />
          <v-btn
            flat
            variant="tonal"
            class="me-2 text-none"
            size="small"
            color="error"
            @click="exitParty()"
          >
            Fermer
          </v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/user.store';
import { usePartyStore } from '@/stores/party.store';
import { getBishopMoves, getKingMoves, getKingRookMoves, getKnightMoves, getPawnsMoves, getRookMoves } from '@/utils/movesApi';
import DialogChessMate from './DialogChessMate.vue';
import Players from './Players.vue';
import socket from '@/services/socket';
import type { IPlayers } from '@/models/Player';
import { useRouter } from 'vue-router';
import { usePlayerStore } from '@/stores/players.store';

const router = useRouter();
const userStore = useUserStore();
const partyStore = usePartyStore();
const playerStore = usePlayerStore();
type PromateType = { piece: string; image: string }[];


const board = ref<string[][]>(createBoard());
const selectedPiece = ref<number[]>([]);
const validMoves = ref<any>(null);
const currentPlayer = ref<IPlayers>({id: 0,
    name: '',
    pwd: '',
    numberPhone: '',
    solde: 0,
    sexe: '',
    status: '',
    piece: ''});
const kingMoved = ref<{ white: boolean; black: boolean }>({ white: false, black: false });
const rookMoved = ref<{ white: { left: boolean; right: boolean }; black: { left: boolean; right: boolean } }>({
  white: { left: false, right: false },
  black: { left: false, right: false }
});
const blackTime = ref<number>(60);
const whiteTime = ref<number>(60);
const topTimerRunning = ref<boolean>(false);
const bottomTimerRunning = ref<boolean>(false);
const topInterval = ref<number>(0);
const bottomInterval = ref<number>(0);
const showDialog = ref<boolean>(false);
const isMobile = ref<boolean>(window.innerWidth <= 768);
const audioWchess = new URL('@/assets/audio/chessKingHomme1.mp3', import.meta.url).href;
const audioBchess = new URL('@/assets/audio/chessKingFemme1.mp3', import.meta.url).href;
const dialogPromated = ref<boolean>(false);
const timeout = ref<boolean>(false);
const promate = ref<PromateType>([]);
const rowPromoted = ref<number>(0);
const colPromoted = ref<number>(0);
const kingAlreadyMoves = ref<boolean>(false);
const lastMove = ref<any>(null);
const player1 = ref<IPlayers>({id: 0,
    name: '',
    pwd: '',
    numberPhone: '',
    solde: 0,
    sexe: '',
    status: '',
    piece: ''});;
const player2 = ref<IPlayers>({id: 0,
    name: '',
    pwd: '',
    numberPhone: '',
    solde: 0,
    sexe: '',
    status: '',
    piece: ''});
    ;
const loading = ref<boolean>(true);
const allPlayers = ref<any[]>([]);

const imageClass = computed(() => (isMobile.value ? 'mobile-image' : 'web-image'));

// Fonction pour créer l'échiquier
function createBoard(): string[][] {
  // Votre logique de création d'échiquier ici
  return [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ];
}

// Vérifier la plateforme
function checkPlatform() {
  isMobile.value = window.innerWidth <= 768;
}

function reloadPage() {
  window.location.reload();
}

function exitParty(){
  router.push('/')
}

// // Basculer le minuteur
// function toggleTimer1(playerPiece: string) {
//   if (playerPiece === 'white') {
//     topTimerRunning.value = true;
//     bottomTimerRunning.value = false;
//   } else {
//     topTimerRunning.value = false;
//     bottomTimerRunning.value = true;
//   }
// }

// Montée et démontage
onMounted(() => {
  window.addEventListener('resize', checkPlatform);
  setTimeout(() => {
    if (partyStore.party) {
      allPlayers.value = JSON.parse(partyStore.party.players);
      player1.value = allPlayers.value[0];
      player2.value = allPlayers.value[1];
      allPlayers.value.forEach(player => {
        if (player.id === userStore.user.id && player.piece === 'white') {
          currentPlayer.value = player;
        }
      });
      blackTime.value = partyStore.party.timer;
      whiteTime.value = partyStore.party.timer;
      toggleTimer(currentPlayer.value.piece);
      loading.value = false;
    }
  }, 1000);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkPlatform);
  if (topInterval.value) clearInterval(topInterval.value);
  if (bottomInterval.value) clearInterval(bottomInterval.value);
});

// Écouter les mises à jour du plateau de jeu
socket.onGameBoardUpdated(async (data: any) => {
  currentPlayer.value = data.currentPlayer;
  board.value = data.board;
  topTimerRunning.value = data.topTimerRunning;
  bottomTimerRunning.value = data.bottomTimerRunning;
  lastMove.value = data.lastMove;
  toggleTimer(currentPlayer.value.piece);
  await checkForCheck();
});

    function formatTime(seconds:number) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const time = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
      if (time === '0:00') {
        timeout.value = true
        allPlayers.value.forEach( player =>{
          if(player.name === currentPlayer.value.name){
            console.log('vaincu', player.name)
          }else{
            console.log('vainqueur', player.name)
          }
        })
        return 
      }
      return time;
    }

    function toggleTimer(playerColor:string) {
      currentPlayer.value.piece === 'white' ? topTimerRunning.value = true : topTimerRunning.value = false;
      currentPlayer.value.piece === 'black' ? bottomTimerRunning.value = true : bottomTimerRunning.value = false;
      if (playerColor) {
        if (topTimerRunning.value) {
          clearInterval(topInterval.value);
        } else {
          topInterval.value = setInterval(() => {
            if (blackTime.value > 0) {
              blackTime.value--;
            } else {
              clearInterval(topInterval.value);
            }
          }, 1000);
        }

        if (bottomTimerRunning.value) {
          clearInterval(bottomInterval.value);
        } else {
          bottomInterval.value = setInterval(() => {
            if (whiteTime.value > 0) {
              whiteTime.value--;
            } else {
              clearInterval(bottomInterval.value);
            }
          }, 1000);
        }
      }
    }

    function getCellColor(row:number, col:number) {
      return (row + col) % 2 === 0 ? 'white-cell' : 'black-cell';
    }

    function getPieceImage(piece:string) {
      const pieceImages: { [key: string]: string } = {
        'P': new URL('@/assets/chess-p/white-pawn.svg', import.meta.url).href,
        'R': new URL('@/assets/chess-p/white-rook.svg', import.meta.url).href,
        'N': new URL('@/assets/chess-p/white-knight1.svg', import.meta.url).href,
        'B': new URL('@/assets/chess-p/white-bishop1.svg', import.meta.url).href,
        'Q': new URL('@/assets/chess-p/white-queen.svg', import.meta.url).href,
        'K': new URL('@/assets/chess-p/white-king.svg', import.meta.url).href,
        'p': new URL('@/assets/chess-p/black-pawn1.svg', import.meta.url).href,
        'r': new URL('@/assets/chess-p/black-rook.svg', import.meta.url).href,
        'n': new URL('@/assets/chess-p/black-knight.svg', import.meta.url).href,
        'b': new URL('@/assets/chess-p/black-bishop1.svg', import.meta.url).href,
        'q': new URL('@/assets/chess-p/black-queen.svg', import.meta.url).href,
        'k': new URL('@/assets/chess-p/black-king.svg', import.meta.url).href
      };
      return pieceImages[piece];
    }

    async function handleCellClick(row:number, col:number) {
      const selectedPiece = board.value[row][col];

      if (!isCurrentUserTurn()) return;

      if (isValidMove(row, col)) {
        if(!isSelectablePiece(selectedPiece)) await processMove(row, col);
        // return;
      }

      if (isSelectablePiece(selectedPiece)) {
        await selectPieceAndFetchMoves(row, col, selectedPiece);
      }
    }

    // async function updatePartyboard():Promise<void> {
    //   // Simuler une mise à jour du tableau de jeu avec un délai
    //   return new Promise((resolve) => {
    //     setTimeout(() => {
    //         // this.board = this.board
    //         // this.currentPlayer = this.currentPlayer
    //         // this.topTimerRunning = this.topTimerRunning
    //         // this.bottomTimerRunning =this.bottomTimerRunning,
    //         // this.lastMove = this.lastMove
    //         toggleTimer(currentPlayer.value.piece)
    //       resolve();
    //     }, 900);
    //   });
    // }

    function isCurrentUserTurn() {
      return userStore.user.id === currentPlayer.value.id;
    }

    function isValidMove(row:number, col:number) {
      return selectedPiece.value && validMoves.value && validMoves.value.some((move : number[] )=> move[0] === row && move[1] === col);
    }

    async function processMove(row:number, col:number) {
      movePiece(selectedPiece.value, [row, col]);
      switchTurn();
      await updateGameBoard();
    }

    function switchTurn() {
      currentPlayer.value = currentPlayer.value.id === player1.value.id ? player2.value : player1.value;
    }

    async function updateGameBoard() {
      try {
        // await this.updatePartyboard()
        toggleTimer(currentPlayer.value.piece)
        socket.updateGameBoard(
          partyStore.party.id,
          board.value,
          partyStore.party.status,
          currentPlayer.value,
          topTimerRunning.value,
          bottomTimerRunning.value,
          lastMove.value
        );
      } catch (error) {
        console.error('Error updating game board:', error);
      }
    }

    function isSelectablePiece(selectedPiece:string) {
      const isWhite = selectedPiece === selectedPiece.toUpperCase();
      return selectedPiece && ((currentPlayer.value.piece === 'white' && isWhite) || (currentPlayer.value.piece === 'black' && !isWhite));
    }

    async function selectPieceAndFetchMoves(row:number, col:number, selectedPiece:string) {
      // selectedPiece = [row, col];
      try {
        validMoves.value = await getValidMoves(row, col, selectedPiece);
      } catch (error) {
        console.error('Error in getValidMoves:', error);
      }
    }

    function movePiece(from: number[], to: number[]) {
      const [fromRow, fromCol] = from;
      const [toRow, toCol] = to;
      board.value[toRow][toCol] = board.value[fromRow][fromCol];
      board.value[fromRow][fromCol] = '';
      lastMove.value = {
        from: [fromRow, fromCol],
        to : [toRow, toCol]
      }

    }

    // Verification pour pouvoir faire un roque
    function isValidKingsideCastling(isWhite : boolean): boolean {
      const kingRow = isWhite ? 0 : 7;
      if (board.value[kingRow][5] !== '' || board.value[kingRow][6] !== '' || kingRow === 7 && kingMoved.value.black || kingRow === 0 && kingMoved.value.white) {
        return false
      } else {
        if (kingRow === 0) {
          rookMoved.value.white.left =true
        } else {
          rookMoved.value.black.left =true
        }
        return true
      }
    }

    //// eto miakatra tsika zao anh

    function isValidQueensideCastling(isWhite: boolean): boolean {
        const kingRow = isWhite ? 0 : 7;

        // Check if the squares between the king and rook are empty
        if (
          board.value[kingRow][1] !== '' ||
          board.value[kingRow][2] !== '' ||
          board.value[kingRow][3] !== '' ||
            (kingRow === 7 && kingMoved.value.black) ||
            (kingRow === 0 && kingMoved.value.white)
        ) {
            return false;
        } else {
            if (kingRow === 0) {
              rookMoved.value.white.right = true;
            } else {
              rookMoved.value.black.right = true;
            }
            return true;
        }
    }


    // echec au roi
    async function checkForCheck(): Promise<boolean> {
      const whiteKingPosition = findKing('K');
      const blackKingPosition = findKing('k');

      const whiteCheckAudio = document.getElementById('whiteCheckAudio') as HTMLAudioElement;
      const blackCheckAudio = document.getElementById('blackCheckAudio') as HTMLAudioElement;

      if (whiteKingPosition) {
          const isInCheck = await handleCheck(whiteKingPosition, 'black', whiteCheckAudio, blackCheckAudio, 'white');
          if (isInCheck) return true;
      }

      if (blackKingPosition) {
          const isInCheck = await handleCheck(blackKingPosition, 'white', blackCheckAudio, whiteCheckAudio, 'black');
          if (isInCheck) return true;
      }

      return false;
    }

    async function handleCheck(kingPosition: { x: number; y: number }, attackingColor: 'white' | 'black', 
        checkAudio: HTMLAudioElement, otherAudio: HTMLAudioElement, playerColor: 'white' | 'black'): Promise<boolean> {
        
        if (isSquareUnderAttack(kingPosition, attackingColor)) {
            if (await isCheckmate(playerColor)) {
                showDialog.value = true;
            } else {
               (playerStore.players[0].sexe === 'homme' && currentPlayer.value.piece === playerColor) ?
                    checkAudio.play() :
                    otherAudio.play();
            }
            return true;
        }
        return false;
    }



    function findKing(king: 'K' | 'k'): { x: number; y: number } {
        for (let y = 0; y < board.value.length; y++) {
            for (let x = 0; x < board.value[y].length; x++) {
            if (board.value[y][x] === king) {
                return { x, y };
            }
            }
        }
        throw new Error(`King ${king} not found on the board`);
    }


    function isSquareUnderAttack(square: { x: number; y: number }, attackingColor: 'white' | 'black'): boolean {
      if (checkPawnAttack(square, attackingColor)) return true;
      if (checkKnightAttack(square, attackingColor)) return true;
      if (checkSlidingPieceAttack(square, attackingColor, ['b', 'q'], [
          { x: 1, y: 1 }, { x: -1, y: -1 },
          { x: 1, y: -1 }, { x: -1, y: 1 }
      ])) return true;
      if (checkSlidingPieceAttack(square, attackingColor, ['r', 'q'], [
          { x: 1, y: 0 }, { x: -1, y: 0 },
          { x: 0, y: 1 }, { x: 0, y: -1 }
      ])) return true;
      if (checkKingAttack(square, attackingColor)) return true;

      return false;
    }

    function checkPawnAttack(square: { x: number; y: number }, attackingColor: 'white' | 'black'): boolean {
        const pawnDirection = attackingColor === 'white' ? -1 : 1;
        const pawnAttacks = [
            { x: square.x + 1, y: square.y + pawnDirection },
            { x: square.x - 1, y: square.y + pawnDirection }
        ];

        for (const attack of pawnAttacks) {
            if (isOnBoard(attack.x, attack.y)) {
                const piece = board.value[attack.y][attack.x];
                if (piece !== '' && isOpponentPieces(piece, attackingColor) && piece.toLowerCase() === 'p') {
                    return true;
                }
            }
        }
        return false;
    }

    function checkKnightAttack(square: { x: number; y: number }, attackingColor: 'white' | 'black'): boolean {
        const knightMoves = [
            { x: 1, y: 2 }, { x: 2, y: 1 }, { x: -1, y: 2 }, { x: -2, y: 1 },
            { x: 1, y: -2 }, { x: 2, y: -1 }, { x: -1, y: -2 }, { x: -2, y: -1 }
        ];

        for (const move of knightMoves) {
            const x = square.x + move.x;
            const y = square.y + move.y;
            if (isOnBoard(x, y)) {
                const piece = board.value[y][x];
                if (piece !== '' && isOpponentPieces(piece, attackingColor) && piece.toLowerCase() === 'n') {
                    return true;
                }
            }
        }
        return false;
    }

    function checkSlidingPieceAttack(square: { x: number; y: number }, attackingColor: 'white' | 'black', pieceTypes: string[], directions: { x: number; y: number }[]): boolean {
        for (const direction of directions) {
            let x = square.x + direction.x;
            let y = square.y + direction.y;

            while (isOnBoard(x, y)) {
                const piece = board.value[y][x];
                if (piece !== '') {
                    if (isOpponentPieces(piece, attackingColor) && pieceTypes.includes(piece.toLowerCase())) {
                        return true;
                    }
                    break; // Stop checking in this direction if a piece is encountered
                }
                // Move to the next square in the current direction
                x += direction.x;
                y += direction.y;
            }
        }
        return false;
    }

    function checkKingAttack(square: { x: number; y: number }, attackingColor: 'white' | 'black'): boolean {
        const kingMoves = [
            { x: 1, y: 0 }, { x: -1, y: 0 },
            { x: 0, y: 1 }, { x: 0, y: -1 },
            { x: 1, y: 1 }, { x: -1, y: -1 },
            { x: 1, y: -1 }, { x: -1, y: 1 }
        ];

        for (const move of kingMoves) {
            const x = square.x + move.x;
            const y = square.y + move.y;
            if (isOnBoard(x, y)) {
                const piece = board.value[y][x];
                if (piece !== '' && isOpponentPieces(piece, attackingColor) && piece.toLowerCase() === 'k') {
                    return true;
                }
            }
        }
        return false;
    }

    // echec est mate
    async function isCheckmate(color: 'white' | 'black'): Promise<boolean> {
        const kingSymbol = color === 'white' ? 'K' : 'k';
        const kingPosition = findKing(kingSymbol);
        const possibleMoves = await getAllPossibleMoves(color);

        for (const move of possibleMoves) {
            const tempBoard = JSON.parse(JSON.stringify(board.value)); // Créer une copie temporaire du plateau
            makeMove(move); // Effectuer le mouvement temporairement

            // Vérifier si le roi est toujours sous attaque
            if (!isSquareUnderAttack(kingPosition, color === 'white' ? 'black' : 'white')) {
            board.value = tempBoard; // Restaurer le plateau original
            return false; // Il n'est pas en échec et mat
            }
            
            board.value = tempBoard; // Restaurer le plateau original pour le prochain mouvement
        }
        
        return true; // Le roi est en échec et mat
    }


    async function getAllPossibleMoves(color: 'white' | 'black') {
      const moves: { from: { x: number; y: number }; to: { x: number; y: number } }[] = [];
      
      for (let y = 0; y < board.value.length; y++) {
        for (let x = 0; x < board.value[y].length; x++) {
          const piece = board.value[y][x];
          
          if (piece !== '' && isOpponentPieces(piece, color)) {
            const pieceMoves: [number, number][] = await getValidMoves(y, x, piece);  // Typage explicite
            
            for (const move of pieceMoves) {
              moves.push({ from: { x, y }, to: { x: move[1], y: move[0] } });  // Utilisation de move[1] et move[0]
            }
          }
        }
      }
      
      return moves;
    }



    const makeMove = (move: { from: { x: number; y: number }; to: { x: number; y: number } }): void => {
        const piece = board.value[move.from.y][move.from.x];
        board.value[move.from.y][move.from.x] = '';
        board.value[move.to.y][move.to.x] = piece;
    };


    // Check if the row and col are within board boundaries
    const isOnBoard = (x: number, y: number): boolean => {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    };


    const isOpponentPieces = (piece: string, color: 'white' | 'black'): boolean => {
        const isWhite = piece === piece.toUpperCase();
        return (color === 'white' && isWhite) || (color === 'black' && !isWhite);
    };

    //Selection des cases
    const isSelected = (row: number, col: number): boolean => {
        // Vérifiez si la case à la ligne et la colonne données est sélectionnée
        return selectedPiece.value && selectedPiece.value[0] === row && selectedPiece.value[1] === col;
    };

    function enPassant(row: number, col: number, isWhite: boolean): void {
        const direction = isWhite ? 1 : -1;

        if (lastMove.value) {  // Utilisez .value pour accéder à lastMove
            const [lastFromRow, lastFromCol] = lastMove.value.from;
            const [lastToRow, lastToCol] = lastMove.value.to;

            // Vérifiez si le dernier mouvement était un déplacement de deux cases pour un pion adverse
            if (Math.abs(lastFromRow - lastToRow) === 2 && board.value[lastToRow][lastToCol].toLowerCase() === 'p') {
                // Vérifiez si le pion adverse est à côté de notre pion
                if (lastToRow === row && Math.abs(lastToCol - col) === 1) {
                    // Capture en passant
                    if (Math.abs(lastToCol - lastFromCol) !== 1 && board.value[lastToRow][lastToCol].toLowerCase() === 'p') {
                    setTimeout(() => {
                        if (board.value[lastFromRow - direction][lastFromCol].toLowerCase() === '') {
                            board.value[lastToRow][lastToCol] = ''; // Retirer le pion capturé
                            updateGameBoard(); // Mettre à jour le plateau de jeu
                        }
                    }, 1000);
                    }
                }
            }
        }
    }



    async function getValidMoves(row: number, col: number, piece: string): Promise<[number, number][]> {
      const isWhite = piece === piece.toUpperCase();
      let moves: [number, number][] = [];

      try {
          switch (piece.toLowerCase()) {
              case 'p':
                  moves = await handlePawnMoves(row, col, isWhite);
                  break;
              case 'r':
                  moves = await getRookMoves(row, col, isWhite, board.value);
                  break;
              case 'n':
                  moves = await getKnightMoves(row, col, isWhite, board.value);
                  break;
              case 'b':
                  moves = await getBishopMoves(row, col, isWhite, board.value);
                  break;
              case 'q':
                  moves = await getQueenMoves(row, col, isWhite, board.value);
                  break;
              case 'k':
                  moves = await handleKingMoves(row, col, isWhite);
                  break;
          }
      } catch (error) {
          console.error('Error in getValidMoves processing:', error);
      }

      return moves;
    }

    async function handlePawnMoves(row: number, col: number, isWhite: boolean): Promise<[number, number][]> {
        let moves = await getPawnsMoves(row, col, isWhite, board.value, lastMove.value);
        
        // En passant
        try {
            enPassant(row, col, isWhite);
        } catch (error) {
            console.error('Error in enPassant:', error);
        }

        // Promotion de pion
        try {
            checkAndPromotePawn();
        } catch (error) {
            console.error('Error in checkAndPromotePawn:', error);
        }

        return moves;
    }

    async function handleKingMoves(row: number, col: number, isWhite: boolean): Promise<[number, number][]> {
        let moves: [number, number][] = [];
        if (isValidKingsideCastling(isWhite) && !kingAlreadyMoves.value) {
            moves = await getKingRookMoves(row, col, 1, kingMoved.value.black, isWhite, board.value);
            setTimeout(() => checkTRookMoves(row, 6, 'kingside'), 2500);
        } else if (isValidQueensideCastling(isWhite) && !kingAlreadyMoves.value) {
            moves = await getKingRookMoves(row, col, -1, kingMoved.value.white, isWhite, board.value);
            setTimeout(() => checkTRookMoves(row, 2, 'queenside'), 2500);
        } else {
            moves = await getKingMoves(row, col, isWhite, board.value);
            kingAlreadyMoves.value = true;
        }
        return moves;
    }

    function checkTRookMoves(row: number, col: number, castlingType: 'kingside' | 'queenside'): void {
        try {
            if (board.value[row][col].toLowerCase() === 'k') {
                getTRookMoves(row); // Assurez-vous que cette méthode existe
            }
        } catch (error) {
            console.error(`Error in getTRookMoves (${castlingType} castling):`, error);
        }
    }

    // Deplacement des pieces...
    const getTRookMoves = (row: number): void => {
        // Déplacements du roi pour la tour blanche
        if (rookMoved.value.white.left && row === 0) {
            if (board.value[row][7] === 'R') {
            board.value[row][5] = 'R';
            board.value[row][7] = '';
            }
        }

        if (rookMoved.value.white.right && row === 0) {
            if (board.value[row][0] === 'R') {
            board.value[row][0] = '';
            board.value[row][3] = 'R';
            }
        }

        // Déplacements du roi pour la tour noire
        if (rookMoved.value.black.left && row === 7) {
            if (board.value[row][7] === 'r') {
            board.value[row][7] = '';
            board.value[row][5] = 'r';
            }
        }

        if (rookMoved.value.black.right && row === 7) {
            if (board.value[row][0] === 'r') {
            board.value[row][0] = '';
            board.value[row][3] = 'r';
            }
        }

        updateGameBoard();    
    };


    const promotePawn = (x: number, y: number, newPiece: string): void => {
        board.value[x][y] = newPiece; // Met à jour la case du pion promu avec la nouvelle pièce
        updateGameBoard(); // Appelle la méthode pour mettre à jour le plateau de jeu
    };


    // Méthode pour vérifier et gérer la promotion d'un pion noir
    const checkAndPromotePawn = (): void => {
        setTimeout(() => {
            for (let x = 0; x < board.value.length; x++) {
            // Vérification pour le pion blanc
            if (board.value[7][x] === 'P') {
                promate.value = [
                { piece: 'Q', image: new URL('@/assets/chess-p/white-queen.svg', import.meta.url).href },
                { piece: 'R', image: new URL('@/assets/chess-p/white-rook.svg', import.meta.url).href  },
                { piece: 'N', image: new URL('@/assets/chess-p/white-knight1.svg', import.meta.url).href  },
                { piece: 'B', image: new URL('@/assets/chess-p/white-bishop1.svg', import.meta.url).href  }
                ];
                rowPromoted.value = 7;
                colPromoted.value = x;
                dialogPromated.value = true;
            }
            
            // Vérification pour le pion noir
            if (board.value[0][x] === 'p') {
                promate.value = [
                { piece: 'q', image: new URL('@/assets/chess-p/black-queen.svg', import.meta.url).href },
                { piece: 'r', image: new URL('@/assets/chess-p/black-rook.svg', import.meta.url).href },
                { piece: 'n', image: new URL('@/assets/chess-p/black-knight.svg', import.meta.url).href },
                { piece: 'b', image: new URL('@/assets/chess-p/black-bishop1.svg', import.meta.url).href }
                ];
                rowPromoted.value = 0;
                colPromoted.value = x;
                dialogPromated.value = true;
            }
            }
        }, 2000);
    };


    const getQueenMoves = async (row: number, col: number, isWhite: boolean, board: string[][]) => {
      // Queen is a combination of rook and bishop
      return [
        ...await getRookMoves(row, col, isWhite, board),
        ...await getBishopMoves(row, col, isWhite, board)
      ];
    };

</script>

<style scoped>
.chessboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  height: 95%;
  margin-top: 20px;
}
.reverse{
  flex-direction: column-reverse;
}
.row {
  display: flex;
  width: 100%;
  flex: 1;
}
.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.white-cell {
  background-color: #f5ebdc;
}
.black-cell {
  background-color: #b58863;
}
.selected {
  background-color: #ffeb3b !important;
}
.piece {
  object-fit: contain;
}
.column-numbers {
  display: flex;
  flex-direction: column-reverse; /* Pour afficher les numéros de haut en bas */
}
.board {
  display: flex;
  flex:1;
  width: 60%;
  height: 70%;
  flex-direction: column-reverse; /* Pour afficher les lettres verticales (A à H) de haut en bas */
  /* transform: rotate(10deg); /* Incliner l'échiquier de 10 degrés */
  /* transform-origin: top left; */
}
@media only screen and (max-width: 768px) {
  .board {
    width: 100%;
  }
  .chessboard{
    height: 70%;
  }
}
.number {
  width: 20px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.letter {
  width: 40px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.letters {
  display: flex;
  justify-content: space-evenly;
}
.timer {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}
.digital-clock {
  display: flex;
  font-family: 'Digital-7', sans-serif;
  width: 80px;
  color: #b58863;
  justify-content: center;
  align-items: center;
  background-color: rgb(233, 215, 195);
  padding: 2px;
  border-radius: 5px;
  font-size: 24px;
}
.timer.paused .digital-clock {
  background-color: #f5ebdc;
  background-size: 10px 10px;
  background-repeat: no-repeat;
  background-position: right top;
  border-color: 2px 2px 2px #b66c2f;
}
.mobile-image {
  width: 40px;
}
.web-image {
  width: 50px;
}
.promotion-options {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.promotion-btn {
  padding: 0;
  margin: 0;
}
.promotion-image {
  width: 50px;
  height: 50px;
}
</style>