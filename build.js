'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var notes = '[CDEFGAB](#?|b?)',
    accidentals = '(b|bb)?',
    chords = '(/[CDEFGAB](#?|b?)|add|m|maj7|maj|min7|min|sus)?',
    suspends = '(1|2|3|4|5|6|7|8|9)?',
    sharp = '(#)?',
    wordsRegex = new RegExp('\\b' + notes + accidentals + chords + suspends + '\\b' + sharp, 'g');

var main = function main(_ref) {
    var $ = _ref.$,
        _ = _ref._,
        jTab = _ref.jtab,
        M = _ref.Materialize;

    /*====================================
    =            initializing            =
    ====================================*/
    var primaryTextArea = $('.primaryTextArea');
    var editorArea = $('.editorArea');
    var previewArea = $('.previewArea');
    var previewWrapper = $('.previewWrapper');

    primaryTextArea.linedtextarea();
    /*=====  End of initializing  ======*/

    var previewButton = $('.preview');

    // removing blank lines
    var removeBlankLines = function removeBlankLines(text) {
        return _.filter(text, function (t) {
            return !_.isEmpty(t);
        });
    };
    var trimText = function trimText(text) {
        return _.map(text, function (t) {
            return _.trim(t);
        });
    };

    var separateChordsAndText = function separateChordsAndText(lines) {
        var foundChords = _.reduce(lines, function (result, line) {
            var currentChords = _.words(line, wordsRegex);
            if (currentChords.length) {
                return [].concat(_toConsumableArray(result), _toConsumableArray(currentChords));
            }
            return result;
        }, []);

        // trimming blank spaces found in chords
        // improper regex
        return _.uniq(_.map(foundChords, function (i) {
            return _.trim(i);
        }));
    };

    previewButton.on('click', function () {
        var currentText = primaryTextArea.val().split('\n');
        var lines = removeBlankLines(currentText);
        var chordList = separateChordsAndText(lines);
        var validatedChords = [];

        _.forEach(chordList, function (chord) {
            var parsedChords = findVoice({ value: chord });
            if (parsedChords.length) {
                validatedChords = [].concat(_toConsumableArray(validatedChords), [chord]);
            }
        });

        editorArea.addClass('hide');

        _.forEach(currentText, function (line, lineIndex) {
            previewWrapper.append(_.replace(line, wordsRegex, function (val) {
                return '<span class="blue-text chord ' + val + '" data-toggle=\'popover\' data-chord=\'' + val + '\'>' + val + '</span>';
            }));
            previewWrapper.append('\n');
        });

        previewArea.removeClass('hide');

        var generatePopover = function generatePopover() {
            return '<div class="popoverWrapper">\n            <div class="card small removeMargin">\n            <div class="card-image">\n                <div class="jTabArea"></div>\n            </div>\n            <div class="card-content">\n                <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>\n            </div>\n          </div>\n        </div>';
        };

        var popoverOptions = {
            container: 'body',
            placement: 'top',
            trigger: 'click',
            html: true,
            content: generatePopover
        };

        $('[data-toggle="popover"]').popover(popoverOptions);
        $('[data-toggle="popover"]').on('shown.bs.popover', function () {
            var $this = $(this);
            var currentChord = $this.data('chord');
            var $popover = $('.popover');
            var jTabArea = $popover.find('.jTabArea');
            var cardContent = $popover.find('.card-content');
            cardContent.prepend('<span class="card-title">' + currentChord + '</span>');
            jTab.render(jTabArea, currentChord);
        });
    });
};

main(window);
