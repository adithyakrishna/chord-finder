'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var notes = '[CDEFGAB](#?|b?)',
    accidentals = '(b|bb)?',
    chords = '(/[CDEFGAB](#?|b?)|add|m|maj7|maj|min7|min|sus)?',
    suspends = '(1|2|3|4|5|6|7|8|9)?',
    sharp = '(#)?',
    wordsRegex = new RegExp('\\b' + notes + accidentals + chords + suspends + '\\b' + sharp, 'g');
var squareBracketsRegex = new RegExp('\[(.*?)\]');

var main = function main(_ref) {
    var $ = _ref.$,
        _ = _ref._,
        jTab = _ref.jtab;

    /*====================================
    =            initializing            =
    ====================================*/
    var primaryTextArea = $('.primaryTextArea');
    var editorArea = $('.editorArea');
    var previewArea = $('.previewArea');
    var songTitle = $('.previewArea .songTitle');
    var songLabels = $('.previewArea .songLabels');
    var previewWrapper = $('.previewWrapper');
    var goBack = $('.goBack');
    var previewTitleText = '';

    if (!editorArea.hasClass('hidden')) {
        primaryTextArea.linedtextarea();
    }
    $('.ui.dropdown').dropdown();
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

    var parseFieldName = function parseFieldName(name) {
        // this will work only for song field
        return _.startCase(_.replace(name, /song\[(.*?)\]/gi, '$1'));
    };

    var buildTitleText = function buildTitleText(field) {
        // since for is sirealized, the first field will always be song-name and 2nd, artist name
        previewTitleText += (field.name === 'song[song-name]' ? '' : ' By') + ' ' + field.value;
    };

    previewButton.on('click', function () {
        var currentText = primaryTextArea.val().split('\n');
        var lines = removeBlankLines(currentText);
        var chordList = separateChordsAndText(lines);
        var validatedChords = [];
        // Clearing fields
        previewTitleText = '';
        previewWrapper.html('');
        songTitle.html('');
        songLabels.html('');
        var songInfoArray = $('.songInfo').serializeArray();

        var songInfoLabels = _.reduce(songInfoArray, function (result, infoItem) {
            if (infoItem.name === 'song[song-name]' || infoItem.name === 'song[artist-name]') {
                buildTitleText(infoItem);
                return "";
            } else {
                return result + '<div class="ui label">' + parseFieldName(infoItem.name) + '<div class="detail">' + infoItem.value + '</div></div>';
            }
        }, "");

        songTitle.html(previewTitleText + ' - Preview');
        songLabels.append(songInfoLabels);

        _.forEach(chordList, function (chord) {
            var parsedChords = findVoice({ value: chord });
            if (parsedChords.length) {
                validatedChords = [].concat(_toConsumableArray(validatedChords), [chord]);
            }
        });

        editorArea.addClass('hidden');

        _.forEach(currentText, function (line, lineIndex) {
            previewWrapper.append(_.replace(line, wordsRegex, function (val) {
                return '<span href="Javascript:void(0);" class="chord ' + val + '" data-chord=\'' + val + '\'>' + val + '</span>';
            }));
            previewWrapper.append('\n');
        });

        previewArea.removeClass('hidden');

        var onPopupShown = function onPopupShown(elem) {
            var $popupTrigger = $(elem);
            var currentChord = $popupTrigger.data('chord');
            var $popup = $popupTrigger.popup('get popup');
            var jTabArea = $popup.find('.jTabArea');

            jTab.render(jTabArea, currentChord, function (elem) {
                $popup.find('.ui.active.dimmer').remove();
            });
        };

        $('.chord').each(function (i, elem) {
            var $elem = $(elem);
            var currentChord = $elem.data('chord');
            $elem.popup({
                hoverable: true,
                exclusive: true,
                on: 'click',
                title: 'check',
                className: {
                    popup: 'ui popup removePadding'
                },
                html: '<div class="popoverWrapper">\n                    <div class="ui blue card">\n                        <div class="content">\n                            Chord Data\n                            <div class="right floated meta">\n                                <div class="ui label">\n                                    Usage\n                                    <div class="detail">214</div>\n                                </div>\n                            </div>\n                        </div>\n                        <div class="image">\n                            <div class="jTabArea"></div>\n                        </div>\n                        <div class="content">\n                            <h1 class="dividing header">' + currentChord + '</h1>\n                            <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>\n                        </div>\n                        <div class="extra content">\n                            Variations\n                        </div>\n                    </div>\n                </div>',
                onVisible: onPopupShown
            });
        });
    });

    goBack.on('click', function (e) {
        editorArea.removeClass('hidden');
        previewArea.addClass('hidden');
    });
};

main(window);
