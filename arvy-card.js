import loaclDatas from './src/local_datas/wods.json'
import style from './build/style.css'
const template = document.createElement('template');

template.innerHTML = `
  <style>
    ${style}
  </style>
  <div class="arvy">
    <h1 class="arvy-title">Nos wods de CrossFit par Arvy</h1>
    <div class="arvy-wods"></div>
  </div>
`

class ArvyCard extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ 'mode': 'open' });
      this._shadowRoot.appendChild(template.content.cloneNode(true));
      this.allowDisplay = ["equipment","exercises","trainerTips"];
      this.allowDisplayWording = 
        {
          "equipment":"Équipments",
          "exercises":"Exercices",
          "trainerTips":"Conseils d'entraîneur"
        };
    }

    get isLocal() {
        return this.getAttribute('isLocal');
    }
      
    get pathData() {
        return this.getAttribute('pathData');
    }
          
    get apiKey() {
        return this.getAttribute('apiKey');
    }

    get width() {
      return this.getWidth('apiKey');
    }

    get height() {
      return this.getHeight('apiKey');
    }

    //show all wods from list
    showWodList(dataset){
      this.$containt = this._shadowRoot.querySelector('.arvy-wods');
      dataset.workouts.forEach(wod => {
          let wodCard = document.createElement('div');
          wodCard.classList = "arvy-wod-card"
          wodCard.innerHTML = `
            <div class="arvy-wod-head">
              <h2 class="arvy-wod-title">${wod.name}</h2>
              <p class="arvy-wod-mode">${wod.mode}</p>
            </div>
          `
          wodCard.appendChild(this.getCardBody(wod));

          this.$containt.appendChild(wodCard);
      });
    }

    //show all parameter from wod
    getCardBody(list) {
      const htmlCardBody = document.createElement('div');
      htmlCardBody.classList = 'arvy-wod-body';

      this.allowDisplay.forEach(elementShow => {

        if(list[elementShow].length > 0){
          const htmlContainer = document.createElement('div');
          htmlContainer.classList = '.arvy-wod-'+elementShow;
  
          const title = document.createElement('h3');
          title.innerText = this.allowDisplayWording[elementShow];
          htmlContainer.appendChild(title);
          
          htmlContainer.appendChild(this.getElementContent(list[elementShow]));

          htmlCardBody.appendChild(htmlContainer);
        }
      });
      return htmlCardBody;
    }

    //show all value from parameter
    getElementContent(list){
      let htmlListContainer = document.createElement('ul');
      list.forEach(value => {
        let htmlListElement = document.createElement('li')
        htmlListElement.innerText = value;

        htmlListContainer.appendChild(htmlListElement);
      })
      return htmlListContainer;
    }
      
    //index function
    connectedCallback() {
      if(!this.isLocal && this.apiKey !== null ){
          var xmlHttp = new XMLHttpRequest();
          const url = `http://arvy.app/api/workflow?key=${this.apiKey}`
          xmlHttp.open("GET", url, false);
          xmlHttp.send(null);
          this.showWodList(JSON.parse(xmlHttp.responseText));
      }else{            
        this.showWodList(loaclDatas);
      }
    }
  }

  window.customElements.define('arvy-card', ArvyCard);