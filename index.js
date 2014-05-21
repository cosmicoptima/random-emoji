var emojis = require('emoji-named-characters');
var shuffle = require('shuffle-array');
var emojiNames = Object.keys(emojis.mapping);

function imgSrc(host, name) {
    if (!host) {
        host = '/';
    } else {
        host = host.slice(-1) === '/' ? host : host + '/';
    }
    return host + encodeURIComponent(name) + '.png';
}

function emojiImage(host, name, height) {
    return '<img class="emoji" title="' + name + '" alt="' + name + '" src="' + imgSrc(host, name) + '"' + ' height="' + (height || 64) + '"' + ' />';
}

function mapEmoji(options) {
    return function (emoji) {
        return {
            character: emojis.mapping[emoji],
            name: emoji,
            image: emojiImage(options.host, emoji, options.height),
            imageSrc: imgSrc(options.host, emoji)
        };
    };
}


exports.random = function (options) {
    if (!options) {
        options = {};
    }
    return shuffle.pick(emojiNames, options.count || 3).map(mapEmoji(options));
};


function countSyllables(sentence) {
    var total = 0;
    var count = function (word) {
        var check = word.replace(/[^a-zA-Z]/g, '');
        check = check.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
        var syllables = check.match(/[aeiouy]{1,2}/g);
        return syllables ? syllables.length : 0;
    };

    sentence.split(/[\W]+/).forEach(function (word) {
        total += count(word);
    });

    return total;
}

function fetchSyllables(count, randomEmoji) {
    var result = [];
    var current = 0;
    var currentEmoji;
    var emojiCount;

    while (current < count) {
        currentEmoji = randomEmoji.pop();
        emojiCount = countSyllables(currentEmoji);

        if ((current + emojiCount) > count) {
            continue;
        }

        result.push(currentEmoji);
        current += emojiCount;
    }

    return result;
}

exports.haiku = function (options) {
    var asEmoji = mapEmoji(options || {});
    var randomEmoji = shuffle(emojiNames, true);
    return [
        fetchSyllables(5, randomEmoji).map(asEmoji),
        fetchSyllables(7, randomEmoji).map(asEmoji),
        fetchSyllables(5, randomEmoji).map(asEmoji)
    ];
};
