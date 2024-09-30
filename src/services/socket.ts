// socketService.js
import {io, Socket} from 'socket.io-client';

class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      withCredentials: true
    });
  }

  updateGameBoard(partyId:number, board:any, status: string, currentPlayer:any, topTimerRunning:boolean, bottomTimerRunning :boolean, lastMove:any) {
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

  readyToPlay(players:any){
    this.socket.emit('readyToPlay',{
      players
    });
  }

  onReadyPlayer(callback:any) {
    this.socket.on('readyToPlay', callback);
  }

  onGameBoardUpdated(callback:any) {
    this.socket.on('gameBoardUpdated', callback);
  }

  onPartyListUpdated(callback:any) {
    this.socket.on('partyListUpdated', callback);
  }

  onNewParty(callback:any) {
    this.socket.on('newParty', callback);
  }

  onPartySelected(callback:any) {
    this.socket.on('partySelected', callback);
  }
}

export default new SocketService();
