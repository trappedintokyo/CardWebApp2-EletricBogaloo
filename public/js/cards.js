
///To start, we need to think about our requirements. There are 52 cards in a deck, which can have one of 4 suits and one of 13 values. We can store our deck as an array. By iterating over each suit and then each value we can populate it as follows:

class Deck {
  constructor() {
    this.deck = [];

    const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
    const values = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];

    for (let suit in suits) {
      for (let value in values) {
        this.deck.push(`${values[value]} of ${suits[suit]}`);
      }
    }
  }
}

const deck1 = new Deck();
console.log(deck1.deck);

// shuffle() {
//     const { deck } = this;
//     let m = deck.length, i;
//
//     while (m) {
//       i = Math.floor(Math.random() * m--);
//
//       [deck[m], deck[i]] = [deck[i], deck[m]];
//     }
//
//     return this;
//   }
