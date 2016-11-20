import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Markov from 'libmarkov';
import routing from './main.routes';

export class MainController {
  markovObjects= [{handle:'@jordan', tweets:[]}];

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {}

  addMarkovObject() {
    this.markovObjects.push({
      handle: '',
      tweets: []
    })
  }

  generateTweet(markovObj) {
    if (markovObj.handle) {
      this.$http.get(`/api/user-tweets/${markovObj.handle}`)
        .then(response => {
          let data = response.data;
          let text = data.tweets.join('\n');
          let generator = new Markov(text);
          markovObj.tweets.push(generator.generate(1));
        })
        .catch(response => {
          this.$http.post('/api/user-tweets', {
            _id: markovObj.handle
          })
            .then(response => {
              this.generateTweet(markovObj);
            })
        })
    } else {
      alert('Enter a twitter handle first')
    }
  }
}

export default angular.module('doppelApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
