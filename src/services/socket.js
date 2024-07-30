// socketService.js
import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = io('http://localhost:3000', {
      withCredentials: true
    });
  }

  updateGameBoard(partyId, board, status, currentPlayer, topTimerRunning, bottomTimerRunning, lastMove) {
    this.socket.emit('gameBoardUpdated', {
      partyId,
      board,
      status,
      currentPlayer,
      topTimerRunning,
      bottomTimerRunning,
      lastMove
    });
  }

  onGameBoardUpdated(callback) {
    this.socket.on('gameBoardUpdated', callback);
  }

  onPartyListUpdated(callback) {
    this.socket.on('partyListUpdated', callback);
  }

  onNewParty(callback) {
    this.socket.on('newParty', callback);
  }

  onPartySelected(callback) {
    this.socket.on('partySelected', callback);
  }
}

export default new SocketService();
