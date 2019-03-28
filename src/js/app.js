import {Dialogue, DialogueList, Message, MessageList} from "./lib.js";
import {checkDialogues} from "./valid.js";


const startChatEl = document.querySelector('.start-chat');
const dialogueListEl = document.querySelector('.dialogues-list');
const companionEl = document.querySelectorAll('.companion');
const chatEl = document.querySelector('.chat');

const companions = Array.from(companionEl);
const dialogueList = new DialogueList();
const messageList = new MessageList();

//todo: отправка сообщений

let id = 0;
for (const companion of companions) {
    id++;
    companion.setAttribute('data-id', id);
    // companion.setAttribute('data-id', id++);
    // const idName = companion.attributes[1].value;

    const name = companion.textContent;
    const image = companion.children[0].attributes[0].textContent;
    const dialogue = new Dialogue(name, image, id);

    companion.addEventListener('click', (evt) => {      //при клике создается новый чат
        let id = companion.attributes[1].value;
        console.log(id);
        if (checkDialogues(id, dialogueList) > 0) {                 //проверяет существует ли такой чат
            console.log('Такой чат уже существует');
        } else {
            dialogueList.add(dialogue);                             //добавляет чат в список чатов
        }
        rebuildDialogueList(dialogueListEl, dialogueList);
    })
}

function rebuildDialogueList(dialogueListEl, dialogueList1) {                //создание списка диалогов
    dialogueListEl.innerHTML = ' ';
    for (const item of dialogueList1.items) {
        const liEl = document.createElement('li');
        liEl.setAttribute('data-class', 'dialogues-element');
        liEl.setAttribute('data-id', item.id);
        liEl.innerHTML = `
          <img src="${item.image}"><span>${item.name}</span>
        `;
        dialogueListEl.appendChild(liEl);

        liEl.addEventListener('click', () => {
            createChat(dialogueList, chatEl, item.image, item.name);       //создание окна чата
        })
    }
}

//todo:не сохраняет переписку при переключении между чатами

function createChat(dialogueList1, chatEl, itemImage, itemName) {        //создание окна чата
    chatEl.innerHTML = '';
    const headerEl = document.createElement('header');          //создание header
    headerEl.setAttribute('data-class', 'chat-title');
    headerEl.innerHTML = `
       <img src="${itemImage}"><span>${itemName}</span>
    `;

    const footerEl = document.createElement('footer');          //создание footer
    footerEl.setAttribute('data-class', 'chat-send');
    footerEl.innerHTML = `
        <form data-id="form-send">
            <input data-id="message-text" type="text" placeholder="Введите сообщение">
            <button data-id="send">Отправить</button>
        </form>
    `;
    chatEl.appendChild(headerEl);
    chatEl.appendChild(footerEl);

    const sendEl = footerEl.querySelector('[data-id=form-send]');
    const messageTextEl = footerEl.querySelector('[data-id=message-text]');
    sendEl.addEventListener('submit', (evt) => {        //событие на кнопке 'отправить' сообщение
        evt.preventDefault();
        const messageText = messageTextEl.value;
        const message = new Message(itemName, messageText);

        if (messageText !== '') {
            messageList.add(message);
            rebuildMessageList(chatEl, messageList, itemName, messageText);
        }

        messageTextEl.value = '';
    })
}
function rebuildMessageList(chatEl, messageList, itemName, messageText) {       //создание сообщения
        const divEl = document.createElement('div');
        divEl.innerHTML = `
            <span>You: ${messageText}</span>
        `;
        console.log(divEl);
        chatEl.appendChild(divEl);
}

rebuildDialogueList(dialogueListEl, dialogueList);


