//pegando botões
const btnPlayer1 = document.getElementById("btnPlayer1");
const btnPlayer2 = document.getElementById("btnPlayer2");
const btnReset = document.getElementById("btnReset");

//pegando os spans
const lb = document.getElementById("dice-value");
const p = document.getElementById("player-value");
const roundWin = document.getElementById("player-round-win");

//adiciona tabela
const table = document.createElement('table');
table.setAttribute('id', 'game-table');
const tbody = document.createElement('tbody');
const trHead = document.createElement('tr');
const thPlayer1 = document.createElement('th');
thPlayer1.textContent = 'Jogador 1';
const thPlayer2 = document.createElement('th');
thPlayer2.textContent = 'Jogador 2';
const thResult = document.createElement('th');
thResult.textContent = 'Resultado';
const thRounds = document.createElement('th');
thRounds.textContent = 'Rounds';

//criando tabela
trHead.appendChild(thRounds);
trHead.appendChild(thPlayer1);
trHead.appendChild(thPlayer2);
trHead.appendChild(thResult);
tbody.appendChild(trHead);
table.appendChild(tbody);
document.querySelector('.container').appendChild(table);

//definindo variáveis
let movesPlayer1 = [];
let movesPlayer2 = [];
let nMoves = 0;
let rounds = 0;
let whoWon = [0, 0];

//setando botão inicial para desativado
btnPlayer2.setAttribute('disabled', '');

//função que roda dado
function playDice(maxValue) {
    let dice = Math.floor(Math.random() * maxValue) + 1;
    return dice;
}

//função que diz quem ganhou o jogo
function whoGameWon(whoWon) {
    if (whoWon[0] > whoWon[1]) {
        return 'Jogador 1';
    }
    if (whoWon[1] > whoWon[0]) {
        return 'Jogador 2';
    }
    if (whoWon[1] === whoWon[0]) {
        return 'NENHUM, ambos venceram a mesma quantidade de rounds';
    }
}

//função que atualiza a tabela
function updateTable(rounds, movesPlayer1, movesPlayer2) {
    const tr = document.createElement('tr');
    const thRound = document.createElement('th');
    thRound.textContent = rounds;
    const tdPlayer1 = document.createElement('td');
    tdPlayer1.textContent = movesPlayer1[rounds - 1];
    const tdPlayer2 = document.createElement('td');
    tdPlayer2.textContent = movesPlayer2[rounds - 1];
    const tdResult = document.createElement('td');
    const roundWinner = whoRoundWin(movesPlayer1, movesPlayer2, rounds - 1, whoWon);
    if (roundWinner === 1) {
        tdResult.textContent = 'Jogador 1';
    } else if (roundWinner === 2) {
        tdResult.textContent = 'Jogador 2';
    } else {
        tdResult.textContent = 'Empate';
    }
    tr.appendChild(thRound);
    tr.appendChild(tdPlayer1);
    tr.appendChild(tdPlayer2);
    tr.appendChild(tdResult);
    tbody.appendChild(tr);
    
    // Salvar dados atualizados no LocalStorage
    localStorage.setItem('movesPlayer1', JSON.stringify(movesPlayer1));
    localStorage.setItem('movesPlayer2', JSON.stringify(movesPlayer2));
    localStorage.setItem('rounds', rounds.toString());
    localStorage.setItem('whoWon', JSON.stringify(whoWon));
}

//função que decide quem ganhou
function whoRoundWin(movesPlayer1,movesPlayer2, rounds, whoWon) {
    console.log(movesPlayer1[rounds], " <-> ", movesPlayer2[rounds]);

    if (movesPlayer1[rounds] > movesPlayer2[rounds]) {
        whoWon[0]++
        return 1
    }
    if (movesPlayer2[rounds] > movesPlayer1[rounds]) {
        whoWon[1]++
        return 2
    }
    if (movesPlayer1[rounds] === movesPlayer2[rounds]) {
        return 3
    }
}

//função que diz quem joga
function whoIsPlaying(nMoves) {
    let playing = (nMoves % 2);
    
    if(playing === 0){
        btnPlayer1.setAttribute('disabled', '');
        btnPlayer2.removeAttribute('disabled');
        return 'jogador 2'
    }else if(playing !== 0){
        btnPlayer1.removeAttribute('disabled');;
        btnPlayer2.setAttribute('disabled', '');
        return 'jogador 1'
    }
}

// Função que é executada ao abrir a página
window.addEventListener('DOMContentLoaded', () => {
    // Verificar se há dados salvos no LocalStorage
    const savedMovesPlayer1 = localStorage.getItem('movesPlayer1');
    const savedMovesPlayer2 = localStorage.getItem('movesPlayer2');
    const savedNMoves = localStorage.getItem('nMoves');
    const savedRounds = localStorage.getItem('rounds');
    const savedWhoWon = localStorage.getItem('whoWon');
    console.log('A aba carregou');
  
    console.log('savedMovesPlayer1:', savedMovesPlayer1);
    console.log('savedMovesPlayer2:', savedMovesPlayer2);
    console.log('savedNMoves:', savedNMoves);
    console.log('savedRounds:', savedRounds);
    console.log('savedWhoWon:', savedWhoWon);
  
    if (savedMovesPlayer1 !== null && savedMovesPlayer2 !== null && savedNMoves !== null && savedRounds !== null && savedWhoWon !== null) {
      console.log('O if entrou!');
      movesPlayer1 = JSON.parse(savedMovesPlayer1);
      movesPlayer2 = JSON.parse(savedMovesPlayer2);
      nMoves = parseInt(savedNMoves);
      rounds = parseInt(savedRounds);
      whoWon = JSON.parse(savedWhoWon);
      updateTable(rounds, movesPlayer1, movesPlayer2);
      p.textContent = `É a vez do ${whoIsPlaying(nMoves)}`;
      console.log(movesPlayer1, movesPlayer2, rounds);
    } else {
      console.log('O if não entrou ou algum valor é nulo.');
    }
  });
  
  function updateGameState() {
    localStorage.setItem('movesPlayer1', JSON.stringify(movesPlayer1));
    localStorage.setItem('movesPlayer2', JSON.stringify(movesPlayer2));
    localStorage.setItem('nMoves', (nMoves-1).toString());
    localStorage.setItem('rounds', rounds.toString());
    localStorage.setItem('whoWon', JSON.stringify(whoWon));
  }
  
  //adicionando os eventos aos botões
  
  btnPlayer1.addEventListener('click', () => {
    let result = playDice(6);
    nMoves++;
    let play = `É a vez do ${whoIsPlaying(nMoves + 1)}`;
    console.log(nMoves, ' - ', play);
    lb.textContent = result;
    p.textContent = play;
    movesPlayer1.push(result);
    updateGameState();
  });

  btnPlayer2.addEventListener('click', () => {
    let result = playDice(6);
    nMoves++;
    rounds++;
    let play = `É a vez do ${whoIsPlaying(nMoves+1)}`;
    console.log(nMoves, ' - ', play);
    lb.textContent = result;
    p.textContent = play;
    movesPlayer2.push(result);
    
    if (whoRoundWin(movesPlayer1, movesPlayer2, rounds-1, whoWon) === 3) {
      roundWin.textContent = `O round ${rounds}º foi um empate!`;
    } else {
      roundWin.textContent = `O jogador ${whoRoundWin(movesPlayer1, movesPlayer2, rounds-1, whoWon)} ganhou o ${rounds}º round!`;
    }
    
    console.log("Resultado: jogador 1:", movesPlayer1, " jogador 2:", movesPlayer2);
    
    updateTable(rounds, movesPlayer1, movesPlayer2);
    
    if (rounds === 10) {
      btnReset.textContent = 'Jogar novamente?';
      btnPlayer1.setAttribute('disabled', '');
      btnPlayer2.setAttribute('disabled', '');
      p.textContent = `Fim de jogo!! -> O jogador com mais rounds vencidos é: ${whoGameWon(whoWon)} PARABÉNS!!!`;
    }
    
    updateGameState(); // Salvar dados atualizados no localStorage
  });
  

btnReset.addEventListener('click', () => {
    localStorage.clear();
    location.reload(true);
})