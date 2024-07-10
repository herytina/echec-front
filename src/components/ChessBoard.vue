<template>
  <div class="chessboard">
    <div>
      <Players
        :avatar-url="profilPlayer1"
        :player-name="name = player1.piece ==='black' ? player1.name : player2.name"
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

    <div>
      <Players
        :avatar-url="profilPlayer1"
        :player-name="name = player1.piece ==='white' ? player1.name : player2.name"
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
        elevation="12"
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
  </div>
</template>

<script>
import { useStoreUser } from '@/stores/user.store';
import { getBishopMoves, getKingMoves, getKingRookMoves, getKnightMoves, getPawnsMoves, getRookMoves } from '@/utils/movesApi';
import { getPartybyId, updatePartyboard } from '@/utils/partyApi';
import DialogChessMate from './DialogChessMate.vue';
import Players from './Players.vue';

export default {
  components: {
    DialogChessMate,
    Players
  },
  setup() {
    const userStore = useStoreUser();
    return {
      user: userStore.user,
    };
  },
  data() {
    return {
      board: this.createBoard(),
      selectedPiece: null,
      validMoves: [],
      currentPlayer: {piece:"white"},
      kingMoved: { white: false, black: false },
      rookMoved: {
        white: { left: false, right: false },
        black: { left: false, right: false }
      },
      blackTime: 600,
      whiteTime: 600,
      topTimerRunning: false,
      bottomTimerRunning: false,
      topInterval: null,
      bottomInterval: null,
      showDialog: false,
      isMobile: window.innerWidth <= 768,
      audioWchess: require('@/assets/audio/chessKingHomme1.mp3'),
      audioBchess: require('@/assets/audio/chessKingFemme1.mp3'),
      profilPlayer1: require('@/assets/logo.png'),
      moves: [],
      dialogPromated: false,
      promate : [],
      rowPromoted: 0,
      colPromoted: 0,
      kingAlreadyMoves: false,
      lastMove : null,
      player1:{piece : 'white'},
      player2:{piece : 'black'},
      party:{},
      loading:true
    };
  },
  computed: {
    imageClass() {
      return this.isMobile ? 'mobile-image' : 'web-image';
    }
  },
  async mounted() {
      const id = this.$route.query.id;
      window.addEventListener('resize', this.checkPlatform);
      this.party = await getPartybyId(id)
      setTimeout(() => {
        if(this.party) {
          this.player1 =  this.party.players[0]
          this.player2 =  this.party.players[1]
          this.party.players.forEach( player =>{
            if(player.id === this.user.id && player.piece === 'white'){
              this.currentPlayer = player
            }
          })
          this.toggleTimer(this.currentPlayer.piece)
          this.loading =false
        }
      }, 2000);


  },
  beforeUnmount() {
    window.removeEventListener('resize', this.checkPlatform);
    clearInterval(this.topInterval);
    clearInterval(this.bottomInterval);
  },
  created(){
    this.$socket.addEventListener('message', this.handleWebSocketMessage);
  },
  methods: {
    async handleWebSocketMessage(event) {
      this.message = JSON.parse(event.data); // Mettre à jour la donnée du message
      const data = this.message.data;
      if(this.message.event === 'upBoard' && data.status==='matching' && parseInt(data.id) === this.party.id){
        this.board = data.board
        this.currentPlayer = data.currentPlayer
        this.topTimerRunning = data.isTopTimer
        this.bottomTimerRunning = data.isBottomTimer
        this.selectedPiece = data.selectedPiece
        this.toggleTimer(data.currentPlayer.piece);
        await this.checkForCheck();
      }
    },
    createBoard() {
      let board = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
      ];
      return board;
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const time = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
      if (time === '0:00') {
        console.log("🚀 ~ defaite pour :", this.currentPlayer.name)
      }
      return time;
    },
    toggleTimer(playerColor) {
      // console.log("🚀 ~ playerColor:", playerColor, this.currentPlayer.piece )

      this.currentPlayer.piece === 'white' ? this.topTimerRunning = true : this.topTimerRunning = false;
      this.currentPlayer.piece === 'black' ? this.bottomTimerRunning = true : this.bottomTimerRunning = false;
      if (playerColor) {
        if (this.topTimerRunning) {
          clearInterval(this.topInterval);
        } else {
          this.topInterval = setInterval(() => {
            if (this.blackTime > 0) {
              this.blackTime--;
            } else {
              clearInterval(this.topInterval);
            }
          }, 1000);
        }
        // this.topTimerRunning = !this.topTimerRunning;

        if (this.bottomTimerRunning) {
          clearInterval(this.bottomInterval);
        } else {
          this.bottomInterval = setInterval(() => {
            if (this.whiteTime > 0) {
              this.whiteTime--;
            } else {
              clearInterval(this.bottomInterval);
            }
          }, 1000);
        }
        // this.bottomTimerRunning = !this.bottomTimerRunning;
      }
    },
    getCellColor(row, col) {
      return (row + col) % 2 === 0 ? 'white-cell' : 'black-cell';
    },
    getPieceImage(piece) {
      const pieceImages = {
        'P': require('@/assets/chess-p/white-pawn.svg'),
        'R': require('@/assets/chess-p/white-rook.svg'),
        'N': require('@/assets/chess-p/white-knight1.svg'),
        'B': require('@/assets/chess-p/white-bishop1.svg'),
        'Q': require('@/assets/chess-p/white-queen.svg'),
        'K': require('@/assets/chess-p/white-king.svg'),
        'p': require('@/assets/chess-p/black-pawn1.svg'),
        'r': require('@/assets/chess-p/black-rook.svg'),
        'n': require('@/assets/chess-p/black-knight.svg'),
        'b': require('@/assets/chess-p/black-bishop1.svg'),
        'q': require('@/assets/chess-p/black-queen.svg'),
        'k': require('@/assets/chess-p/black-king.svg')
      };
      return pieceImages[piece];
    },
    async handleCellClick(row, col) {
      const selectedPiece = this.board[row][col];
      if (this.selectedPiece && this.user.id === this.currentPlayer.id) {
        console.log("🚀 ~ selectedPiece a jour :",this. selectedPiece)
        if (this.validMoves.some(move => move[0] === row && move[1] === col)) {
          this.movePiece(this.selectedPiece, [row, col]);
          this.currentPlayer = this.currentPlayer.piece === 'white' ? this.player2 : this.player1 // Switch turn
          await updatePartyboard(this.party.id,this.board,this.party.status, this.currentPlayer, this.topTimerRunning,this.bottomTimerRunning, null)
        }
        this.selectedPiece = null;
        this.validMoves = [];
      } else if (selectedPiece && this.user.id === this.currentPlayer.id) {
        this.selectedPiece = [row, col];
        this.validMoves = await this.getValidMoves(row, col);
        console.log("🚀 ~ this.validMoves:", this.validMoves)
      }
    },
    movePiece(from, to) {
      const [fromRow, fromCol] = from;
      const [toRow, toCol] = to;
      this.board[toRow][toCol] = this.board[fromRow][fromCol];
      this.board[fromRow][fromCol] = '';
      this.lastMove = {
        from: [fromRow, fromCol],
        to : [toRow, toCol]
      }

    },
    // Verification pour pouvoir faire un roque
    isValidKingsideCastling(isWhite) {
      const kingRow = isWhite ? 0 : 7;
      if (this.board[kingRow][5] !== '' || this.board[kingRow][6] !== '' || kingRow === 7 && this.kingMoved.black || kingRow === 0 && this.kingMoved.white) {
        return false
      } else {
        if (kingRow === 0) {
          this.rookMoved.white.left =true
        } else {
          this.rookMoved.black.left =true
        }
        return true
      }
    },
    isValidQueensideCastling(isWhite) {
      const kingRow = isWhite ? 0 : 7;
      // Check if the squares between the king and rook are empty
      if (this.board[kingRow][1] !== '' || this.board[kingRow][2] !== '' || this.board[kingRow][3] !== ''
        || kingRow === 7 && this.kingMoved.black || kingRow === 0 && this.kingMoved.white
      ) {
        return false
      } else {
        if (kingRow === 0) {
          this.rookMoved.white.right =true
        } else {
          this.rookMoved.black.right =true
        }
        return true
      }
    },
    // echec au roi
    async checkForCheck() {
      const whiteKingPosition = this.findKing('K');
      const blackKingPosition = this.findKing('k');

      const whiteCheckAudio = document.getElementById('whiteCheckAudio');
      const blackCheckAudio = document.getElementById('blackCheckAudio');

      if (this.isSquareUnderAttack(whiteKingPosition, 'black')) {
        if (await this.isCheckmate('white')) {
          this.showDialog = true
        } else {
          whiteCheckAudio.play();
        }
        return true;
      }
      if (this.isSquareUnderAttack(blackKingPosition, 'white')) {
        if (await this.isCheckmate('black')) {
          this.showDialog = true
        } else {
          blackCheckAudio.play();
        }
        return true;
      }
      return false;
    },
    findKing(king) {
      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          if (this.board[y][x] === king) {
            return { x, y };
          }
        }
      }
    },
    isSquareUnderAttack(square, attackingColor) {
      // const opponentColor = attackingColor === 'white' ? 'white' : 'black';

      // Check pawn attacks
      const pawnDirection = attackingColor === 'white' ? -1 : 1;
      const pawnAttacks = [
        { x: square.x + 1, y: square.y + pawnDirection },
        { x: square.x - 1, y: square.y + pawnDirection }
      ];
      for (const attack of pawnAttacks) {
        if (this.isOnBoard(attack.x, attack.y)) {
          const piece = this.board[attack.y][attack.x];
          if (piece !== '' && this.isOpponentPieces(piece, attackingColor) && piece.toLowerCase() === 'p') {
            return true;
          }
        }
      }

      // Check knight attacks
      const knightMoves = [
        { x: 1, y: 2 }, { x: 2, y: 1 }, { x: -1, y: 2 }, { x: -2, y: 1 },
        { x: 1, y: -2 }, { x: 2, y: -1 }, { x: -1, y: -2 }, { x: -2, y: -1 }
      ];
      for (const move of knightMoves) {
        const x = square.x + move.x;
        const y = square.y + move.y;
        if (this.isOnBoard(x, y)) {
          const piece = this.board[y][x];
          if (piece !== '' && this.isOpponentPieces(piece, attackingColor) && piece.toLowerCase() === 'n') {
            return true;
          }
        }
      }

      // Check bishop attacks
      const bishopDirections = [
        { x: 1, y: 1 }, { x: -1, y: -1 },
        { x: 1, y: -1 }, { x: -1, y: 1 }
      ];

      for (const direction of bishopDirections) {
        let x = square.x + direction.x;
        let y = square.y + direction.y;

        while (this.isOnBoard(x, y)) {
          const piece = this.board[y][x];
          if (piece !== '') {
            if (this.isOpponentPieces(piece, attackingColor) && (piece.toLowerCase() === 'b') ||
          this.isOpponentPieces(piece, attackingColor) && (piece.toLowerCase() === 'q')) {
              return true;
            }
            break; // Stop checking in this direction if a piece is encountered
          }

          // Move to the next square in the current direction
          x += direction.x;
          y += direction.y;
        }
      }

      // Check rook attacks
      const rookDirections = [
        { x: 1, y: 0 }, { x: -1, y: 0 },
        { x: 0, y: 1 }, { x: 0, y: -1 }
      ];
      for (const direction of rookDirections) {
        let x = square.x + direction.x;
        let y = square.y + direction.y;
        while (this.isOnBoard(x, y)) {
          const piece = this.board[y][x];
          if (piece !== '') {
            if (this.isOpponentPieces(piece, attackingColor) && (piece.toLowerCase() === 'r') ||
          this.isOpponentPieces(piece, attackingColor) && (piece.toLowerCase() === 'q')) {
              return true;
            }
            break;
          }
          x += direction.x;
          y += direction.y;
        }
      }

      // Check king attacks
      const kingMoves = [
        { x: 1, y: 0 }, { x: -1, y: 0 },
        { x: 0, y: 1 }, { x: 0, y: -1 },
        { x: 1, y: 1 }, { x: -1, y: -1 },
        { x: 1, y: -1 }, { x: -1, y: 1 }
      ];
      for (const move of kingMoves) {
        const x = square.x + move.x;
        const y = square.y + move.y;
        if (this.isOnBoard(x, y)) {
          const piece = this.board[y][x];
          if (piece !== '' && this.isOpponentPieces(piece, attackingColor) && piece.toLowerCase() === 'k') {
            return true;
          }
        }
      }

      return false;
    },
    // echec est mate
    async isCheckmate(color) {
      const kingPosition = this.findKing(color === 'white' ? 'K' : 'k');
      const possibleMoves = await this.getAllPossibleMoves(color);

      for (const move of possibleMoves) {
        const tempBoard = JSON.parse(JSON.stringify(this.board));
        this.makeMove(move);
        if (!this.isSquareUnderAttack(kingPosition, color === 'white' ? 'black' : 'white')) {
          this.board = tempBoard;
          return false;
        }
        this.board = tempBoard;
      }
      return true;
    },
    async getAllPossibleMoves(color) {
      const moves = [];
      for (let y = 0; y < this.board.length; y++) {
        for (let x = 0; x < this.board[y].length; x++) {
          const piece = this.board[y][x];
          if (piece !== '' && this.isOpponentPieces(piece, color)) {
            const pieceMoves = await this.getValidMoves(y, x);
            for (const move of pieceMoves) {
              moves.push({ from: { x, y }, to: { y: move[0], x: move[1] } });
            }
          }
        }
      }
      return moves;
    },
    makeMove(move) {
      const piece = this.board[move.from.y][move.from.x];
      this.board[move.from.y][move.from.x] = '';
      this.board[move.to.y][move.to.x] = piece;
    },
    // Check if the row and col are within board boundaries
    isOnBoard(x, y) {
      return x >= 0 && x < 8 && y >= 0 && y < 8;
    },
    isOpponentPieces(piece, color) {
      const isWhite = piece === piece.toUpperCase();
      return (color === 'white' && isWhite) || (color === 'black' && !isWhite);
    },
    //Selection des cases
    isSelected(row, col) {
      // Check if the cell at given row and column is selected
      return this.selectedPiece && this.selectedPiece[0] === row && this.selectedPiece[1] === col;
    },
    enPassant(row, col, isWhite) {
     const direction = isWhite ? 1 : -1;
     if (this.lastMove) {
        const [lastFromRow, lastFromCol] = this.lastMove.from;
        const [lastToRow, lastToCol] = this.lastMove.to;
        // Vérifiez si le dernier mouvement était un déplacement de deux cases pour un pion adverse
        if (Math.abs(lastFromRow - lastToRow) === 2 && this.board[lastToRow][lastToCol].toLowerCase() === 'p') {
          // Vérifiez si le pion adverse est à côté de notre pion
          if (lastToRow === row && Math.abs(lastToCol - col) === 1) {
            // Capture en passant
            if (Math.abs(lastToCol - lastFromCol) !== 1 && this.board[lastToRow][lastToCol].toLowerCase() === 'p') {
              setTimeout(() => {
                if (this.board[lastFromRow - direction][lastFromCol].toLowerCase() === 'p') {
                  console.log('en passant')
                  this.board[lastToRow][lastToCol] = ''; // Retirer le pion capturé
                }
              }, 2500);
            }
            this.moves.push([row + direction, lastToCol]);
          }
        }
      }
    },
    async getValidMoves(row, col) {
      const piece = this.board[row][col];

      if (!piece) return this.moves;

      const isWhite = piece === piece.toUpperCase();

        // Check if it's current player's turn
      if ((this.currentPlayer.piece === 'white' && !isWhite) || (this.currentPlayer.piece === 'black' && isWhite)) {
        return this.moves = []; // Return empty moves if it's not the current player's turn
      }

      if (piece.toLowerCase() === 'p') {
        this.moves = await getPawnsMoves(row, col, isWhite, this.board, this.lastMove);
        this.checkAndPromotePawn();
        this.enPassant(row, col,isWhite)
      } else if (piece.toLowerCase() === 'r') {
        this.moves = await getRookMoves(row, col, isWhite, this.board);
      } else if (piece.toLowerCase() === 'n') {
        this.moves = await getKnightMoves(row, col, isWhite, this.board)
      } else if (piece.toLowerCase() === 'b') {
        this.moves = await getBishopMoves(row, col, isWhite, this.board);
      } else if (piece.toLowerCase() === 'q') {
        this.moves = await this.getQueenMoves(row, col, isWhite, this.board);
      } else if (piece.toLowerCase() === 'k') {
                  console.log("🚀 ~ this.kingAlreadyMoves:", this.kingAlreadyMoves)

        if (this.isValidKingsideCastling(isWhite) && !this.kingAlreadyMoves) {
          this.moves = await getKingRookMoves(row, col, 1,this.kingMoved, isWhite, this.board);
          setTimeout(() => {
            if (this.board[row][6].toLowerCase() === 'k') {
              this.getTRookMoves(row)
            }
          }, 2500);
        } else if (this.isValidQueensideCastling(isWhite) && !this.kingAlreadyMoves) {
          this.moves = await getKingRookMoves(row, col, -1,this.kingMoved, isWhite, this.board);
          setTimeout(() => {
            if (this.board[row][2].toLowerCase() === 'k') {
              this.getTRookMoves(row)
            }
           }, 2500);

        } else {
          this.moves = await getKingMoves(row, col, isWhite, this.board);
          this.kingAlreadyMoves = true
        }
      }

      return this.moves;
    },
    // Deplacement des pieces...
    getTRookMoves(row) {
      if (this.rookMoved.white.left && row === 0) {
        if (this.board[row][7] === 'R') {
          this.board[row][5] = 'R'
          this.board[row][7] = ''
        }
      } if (this.rookMoved.white.right && row === 0) {
        if (this.board[row][0] === 'R') {
            this.board[row][0] = ''
            this.board[row][3] = 'R'
          }
      }if (this.rookMoved.black.left && row === 7 ) {
        if (this.board[row][7] === 'r') {
          this.board[row][7] = ''
          this.board[row][5] = 'r'
        }
      }if (this.rookMoved.black.right && row === 7 ) {
        if (this.board[row][0] === 'r') {
          this.board[row][0] = ''
          this.board[row][3] = 'r'
        }
      }
    },
    promotePawn(x, y, newPiece) {
        this.board[x][y] = newPiece;
    },
    // Méthode pour vérifier et gérer la promotion d'un pion noir
    checkAndPromotePawn() {
      setTimeout(() => {
        for (let x = 0; x < this.board.length; x++) {
          if (this.board[7][x] === 'P') {
            this.promate = [
              { piece: 'Q', image: require('@/assets/chess-p/white-queen.svg') },
              { piece: 'R', image: require('@/assets/chess-p/white-rook.svg') },
              { piece: 'N', image: require('@/assets/chess-p/white-knight1.svg') },
              { piece: 'B', image: require('@/assets/chess-p/white-bishop1.svg') }
            ];
            this.rowPromoted = 7
            this.colPromoted = x
            this.dialogPromated =true
          }
          if (this.board[0][x] === 'p') {
            this.promate = [
              { piece: 'q', image: require('@/assets/chess-p/black-queen.svg') },
              { piece: 'r', image: require('@/assets/chess-p/black-rook.svg') },
              { piece: 'n', image: require('@/assets/chess-p/black-knight.svg') },
              { piece: 'b', image: require('@/assets/chess-p/black-bishop1.svg') }
            ];
            this.rowPromoted= 0
            this.colPromoted = x
            this.dialogPromated =true
          }
        }
      },2000)

    },
    async getQueenMoves(row, col, isWhite, board) {
      // Queen is a combination of rook and bishop
      return [
        ...await getRookMoves(row, col, isWhite, board),
        ...await getBishopMoves(row, col, isWhite, board)
      ];
    },
    checkPlatform() {
      this.isMobile = window.innerWidth <= 768;
    }

  },
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
