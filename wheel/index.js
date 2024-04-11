/*
 * Copyright (c) 2020. shtrih
 */

const dataSets = {
    effects: [
        'Мусорный бак',
        'Вонючий унитаз',
        'Охотничья трапа',
        'Фулл Хауз',
        'Silence',
        'Выгодный обмен',
        'Паническая атака',
        'Подарочек',
        'Мамонтенок',
        'Таинственный незнакомец',
        'Несмешная шутка',
        'Жулик',
        'Выебон',
        'Мошнатор',
        'Коинфлип',
        'Судья дредд',
        'Тодд Говард',
        'Смутное Время',
        'Кот в мешке',
        'Пизда',
        'Организатор тварь',
        'Моментальная флеш',
        'Только хардкор',
        'Бунт',
        'Фанат соулс-лайков',
        'Ошибочка вышла',
        'Летописец',
        'Размер неважен',
        'Судья дредд',
        'Разрабы да...',
        'Бог любит троицу',
        'Магия',
        'Дабл килл',
        'Интригант',
        'Невыгодный обмен',
        'Интригант',
        'Дабл килл',
        'Фулл Хауз',
        'Жулик',
        'Жулик',
        'Жулик',
        'Мошнатор',
        'Небольшой анлак',
        'Небольшой анлак',
        'Выебон',
        'Ебать',
        'Ебать',
        'Небольшой анлак',
        'Небольшой анлак',
        'Подкинул свинью',
    ],
    coin: [
        'Орёл',
        'Решка',
        'Орёл',
        'Решка',
        'Орёл',
        'Решка',
        'Орёл',
        'Решка',
        'Орёл',
        'Решка',
        'Ребро!',
    ],
    streamers: [
        'Slonyara',
        'Ushlepook',
        'Ghoulsss',
        'Glo4',
        'Ermakow',
        'Zordal',
    ],
    debuffs: [
        'Мусорный бак',
        'Вонючий унитаз',
        'Паническая атака',
        'Таинственный незнакомец',
        'Жулик',
        'Таинственный незнакомец',
        'Пизда',
        'Смутное Время',
        'Пизда',
        'Организатор тварь',
        'Моментальная флеш',
        'Только хардкор',
        'Ошибочка вышла',
        'Фанат соулс-лайков',
        'Бог любит троицу',
        'Небольшой анлак',
        'Небольшой анлак',
        'Небольшой анлак',
    ]
};
let currentDataSet = 'effects',
    editedDataSets = {};

const editDialog = document.getElementById('dialog-edit'),
    editButton = document.getElementById('btn-edit'),
    editConfirmButton = editDialog.getElementsByClassName('apply')[0],
    editOptions = editDialog.getElementsByClassName('options')[0],
    editPresets = editDialog.getElementsByClassName('presets')[0],
    optionClick = function (option, checked) {
        editedDataSets[currentDataSet][option] = checked;
    },
    generateOptions = function (dataObject) {
        let options = '';
        for (let i in dataObject) {
            options += `<label><input type="checkbox" onchange="optionClick('${i}', this.checked)" ${dataObject[i] ? 'checked' : ''} />${i}</label><br />`;
        }

        return options;
    },
    resetEditedDataSet = function () {
        editedDataSets[currentDataSet] = Object.fromEntries(dataSets[currentDataSet].map(v => v).sort().map(v => [v, true]));
    },
    editedDataToArray = function () {
        let result = [];

        for (let [key, value] of Object.entries(editedDataSets[currentDataSet])) {
            if (value) {
                result.push(key)
            }
        }

        return result;
    }
;

editButton.addEventListener('click', function () {
    if (currentDataSet === 'custom') {
        p5Instance.mouseDragEnable(false);
        customDialog.style.display = 'block';

        return;
    }

    editDialog.style.display = 'block';
    p5Instance.mouseDragEnable(false);

    editPresets.innerHTML = '';
    editPresets.append(...presets.getNodes(currentDataSet));
    editOptions.innerHTML = generateOptions(editedDataSets[currentDataSet]);
});
editConfirmButton.addEventListener('click', function () {
    editDialog.style.display = 'none';
    p5Instance.mouseDragEnable();

    p5Instance.setData(editedDataToArray());
});

class Preset {
    constructor(title, disabledEntries, isDefault) {
        this._title = title;
        this._disabledEntries = disabledEntries;
        this._isDefault = Boolean(isDefault);
    }

    get isDefault() {
        return this._isDefault;
    }

    get domNode() {
        const el = document.createElement('a');

        el.setAttribute('href', '#');
        el.appendChild(document.createTextNode(this._title));
        el.addEventListener('click', this.handleClick.bind(this));

        return el;
    }

    handleClick() {
        resetEditedDataSet();

        for(const i in this._disabledEntries) {
            if (editedDataSets[currentDataSet][this._disabledEntries[i]]) {
                editedDataSets[currentDataSet][this._disabledEntries[i]] = false;
            }
        }

        editOptions.innerHTML = generateOptions(editedDataSets[currentDataSet]);

        return false;
    }
}

class PresetAll extends Preset {
    constructor(isDefault) {
        super('Выбрать всё', [], isDefault);
    }
}

class PresetWithoutSpecialRolls extends Preset {
    constructor(isDefault) {
        super(
            'Без спецроллов',
            [
                'Фанат соулс-лайков',
                'Летописец',
                'Размер неважен',
                'Судья дредд',
                'Разрабы да...',
                'Never Lucky',
            ],
            isDefault
        );
    }
}

class Presets {
    constructor() {
        this._presets = {
            // inventory: [
            //     new PresetAll(),
            // ],
            effects: [
                new PresetAll(),
                new PresetWithoutSpecialRolls(true),
            ],
            debuffs: [
                new PresetAll(),
                new PresetWithoutSpecialRolls(true),
            ],
            streamers: [
                new PresetAll(),
            ],
        };
    }

    hasPreset(dataSetKey) {
        return !!this._presets[dataSetKey];
    }

    getNodes(dataSetKey) {
        let result = [];

        for(const i in this._presets[dataSetKey]) {
            if (i % 2) {
                result.push(document.createTextNode(', '));
            }
            result.push(this._presets[dataSetKey][i].domNode);
        }

        return result;
    }

    applyDefaults(dataSetKey) {
        for(const i in this._presets[dataSetKey]) {
            if (this._presets[dataSetKey][i].isDefault) {
                this._presets[dataSetKey][i].handleClick();
            }
        }
    }
}

const presets = new Presets;

function getImageURI(index) {
    let result = '../hpg-inventory/images/000.png',
        offset = 0
    ;
    switch (currentDataSet) {
        case "effects":
            result = '../hpg-inventory/images/0' + ('0' + (index+1 + offset)).slice(-2) + '.png';
            break;

        case "debuffs":
            const mapping = [
                1,
                2,
                7,
                10,
                12,
                13,
                16,
                18,
                20,
                21,
                22,
                23,
                26,
                25,
                31,
                44,
                48,
                49
            ];
            result = '../hpg-inventory/images/0' + ('0' + (mapping[index])).slice(-2) + '.png';
            break;

        case "coin":
            result = '../images/coin-obverse-20.png';
            if (index === 1) {
                result = '../images/coin-reverse-20.png';
            }
            if (index === 10) {
                result = '../images/coin-gurt.png';
            }
            break;

        case "streamers":
            result = '../images/streamers/'+ dataSets[currentDataSet][index] +'.jpg';
            break;
    }

    return result;
}

const p5Instance = new p5(wheelSketch);

p5Instance.onAfterSetup = function () {
    p5Instance.setVideos([
        ['videos/Папич-марш  прощание славянки .9мая.mp4', 7],
        ['videos/ДОРА + ДУЛО Дорадуло prod. Илья Муррка.mp4'],
        ['videos/Говновоз & Groove Dealers (mashup).mp4'],
        ['videos/Ryan Gosling - Drive [Meme].mp4'],
        ['videos/МАКSИМ х LANA DEL REY — ОТПУСКАЮ ГРУСТЬ [MASHUP].mp4', 118],
        ['videos/KIRKOROV FILIPP next up real vamp.mp4'],
        ['videos/6 кадров + Pixies Where Is My Mind_.mp4', 23],
        ['videos/ALBLAK 52 — +7(952)812 x Barboskiny (мэшап).mp4'],
        ['videos/Dr Disrespect - Gillette By 199X [Dance Video].mp4', 14],
        ['videos/ОКСИМИРОН_ & СОЛНЦЕ МОНАКО (MASHUP _ OXXXYMIX).mp4', 5],
        ['videos/Плыли мы по морю, ветер мачту рвал (x Gorillaz).mp4'],
    ]);
};

const image = document.querySelector('#item-image img');
p5Instance.onSelectItem = function(data, selectedKey) {
    if (dataSets[currentDataSet]) {
        image.src = getImageURI(dataSets[currentDataSet].indexOf(data[selectedKey]));
    }
    else {
        image.src = '../hpg-inventory/images/000.png';
    }
};

const customDialog = document.getElementById('custom-list'),
    customTextarea = customDialog.getElementsByTagName('textarea')[0],
    customButton = customDialog.getElementsByTagName('button')[0]
;

customButton.addEventListener('click', function () {
    customDialog.style.display = 'none';

    p5Instance.setData(customTextarea.value.split('\n'));
    p5Instance.mouseDragEnable();
});

let radios = document.querySelectorAll('[name="list"]');
for(let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('click', function () {
        currentDataSet = this.value;

        if (this.value === 'custom') {
            p5Instance.mouseDragEnable(false);
            customDialog.style.display = 'block';

            return;
        }

        customDialog.style.display = 'none';
        p5Instance.mouseDragEnable();

        if (presets.hasPreset(currentDataSet)) {
            if (!editedDataSets[currentDataSet]) {
                resetEditedDataSet();
                presets.applyDefaults(currentDataSet);
            }

            p5Instance.setData(editedDataToArray());
            editButton.removeAttribute('disabled');
        }
        else {
            p5Instance.setData(dataSets[currentDataSet]);
            editButton.setAttribute('disabled', 'disabled');
        }
    });

    // Выбираем начальный вариант при загрузке страницы
    if (radios[i].hasAttribute('checked')) {
        radios[i].dispatchEvent(new Event('click'));
    }
}
