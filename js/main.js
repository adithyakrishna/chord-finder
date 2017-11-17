var notes = '[CDEFGAB](#?|b?)',
    accidentals = '(b|bb)?',
    chords = '(/[CDEFGAB](#?|b?)|add|m|maj7|maj|min7|min|sus)?',
    suspends = '(1|2|3|4|5|6|7|8|9)?',
    sharp = '(#)?',
    wordsRegex = new RegExp(
        '\\b' + notes + accidentals + chords + suspends + '\\b' + sharp,
        'g'
    );

const main = ({ $, _, jtab: jTab }) => {
    /*====================================
    =            initializing            =
    ====================================*/
    const primaryTextArea = $('.primaryTextArea');
    const editorArea = $('.editorArea');
    const previewArea = $('.previewArea');
    const previewWrapper = $('.previewWrapper');
    const goBack = $('.goBack');

    if (!editorArea.hasClass('hidden')) {
        primaryTextArea.linedtextarea();
    }
    $('.ui.dropdown').dropdown();
    /*=====  End of initializing  ======*/

    const previewButton = $('.preview');

    // removing blank lines
    const removeBlankLines = text => _.filter(text, t => !_.isEmpty(t));
    const trimText = text => _.map(text, t => _.trim(t));

    const separateChordsAndText = lines => {
        const foundChords = _.reduce(
            lines,
            (result, line) => {
                const currentChords = _.words(line, wordsRegex);
                if (currentChords.length) {
                    return [...result, ...currentChords];
                }
                return result;
            },
            []
        );

        // trimming blank spaces found in chords
        // improper regex
        return _.uniq(_.map(foundChords, i => _.trim(i)));
    };

    previewButton.on('click', () => {
        const currentText = primaryTextArea.val().split('\n');
        const lines = removeBlankLines(currentText);
        const chordList = separateChordsAndText(lines);
        let validatedChords = [];

        // console.log('object', $('.songInfo').serializeArray());

        _.forEach(chordList, chord => {
            const parsedChords = findVoice({ value: chord });
            if (parsedChords.length) {
                validatedChords = [...validatedChords, chord];
            }
        });

        editorArea.addClass('hidden');

        _.forEach(currentText, (line, lineIndex) => {
            previewWrapper.append(
                _.replace(
                    line,
                    wordsRegex,
                    val =>
                        `<span href="Javascript:void(0);" class="chord ${val}" data-chord='${val}'>${val}</span>`
                )
            );
            previewWrapper.append('\n');
        });

        previewArea.removeClass('hidden');

        const onPopupShown = elem => {
            const $popupTrigger = $(elem);
            const currentChord = $popupTrigger.data('chord');
            const $popup = $popupTrigger.popup('get popup');
            const jTabArea = $popup.find('.jTabArea');

            jTab.render(jTabArea, currentChord, elem => {
                $popup.find('.ui.active.dimmer').remove();
            });
        };

        $('.chord').each((i, elem) => {
            const $elem = $(elem);
            const currentChord = $elem.data('chord');
            $elem.popup({
                hoverable: true,
                exclusive: true,
                on: 'click',
                title: 'check',
                className: {
                    popup: 'ui popup removePadding'
                },
                html: `<div class="popoverWrapper">
                    <div class="ui blue card">
                        <div class="content">
                            Chord Data
                            <div class="right floated meta">
                                <div class="ui label">
                                    Usage
                                    <div class="detail">214</div>
                                </div>
                            </div>
                        </div>
                        <div class="image">
                            <div class="jTabArea"></div>
                        </div>
                        <div class="content">
                            <h1 class="dividing header">${currentChord}</h1>
                            <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
                        </div>
                        <div class="extra content">
                            Variations
                        </div>
                    </div>
                </div>`,
                onVisible: onPopupShown
            });
        });
    });

    goBack.on('click', e => {
        editorArea.removeClass('hidden');
        previewArea.addClass('hidden');
    });
};

main(window);
