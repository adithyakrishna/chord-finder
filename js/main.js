var notes = '[CDEFGAB](#?|b?)',
    accidentals = '(b|bb)?',
    chords = '(/[CDEFGAB](#?|b?)|add|m|maj7|maj|min7|min|sus)?',
    suspends = '(1|2|3|4|5|6|7|8|9)?',
    sharp = '(#)?',
    wordsRegex = new RegExp(
        '\\b' + notes + accidentals + chords + suspends + '\\b' + sharp,
        'g'
    );

const main = ({ $, _, jtab: jTab, Materialize: M }) => {
    /*====================================
    =            initializing            =
    ====================================*/
    const primaryTextArea = $('.primaryTextArea');
    const editorArea = $('.editorArea');
    const previewArea = $('.previewArea');
    const previewWrapper = $('.previewWrapper');

    primaryTextArea.linedtextarea();
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

        _.forEach(chordList, chord => {
            const parsedChords = findVoice({ value: chord });
            if (parsedChords.length) {
                validatedChords = [...validatedChords, chord];
            }
        });

        editorArea.addClass('hide');

        _.forEach(currentText, (line, lineIndex) => {
            previewWrapper.append(
                _.replace(
                    line,
                    wordsRegex,
                    val =>
                        `<span class="blue-text chord ${val}" data-toggle='popover' data-chord='${val}'>${val}</span>`
                )
            );
            previewWrapper.append('\n');
        });

        previewArea.removeClass('hide');

        const generatePopover = () => {
            return `<div class="popoverWrapper">
            <div class="card small removeMargin">
            <div class="card-image">
                <div class="jTabArea"></div>
            </div>
            <div class="card-content">
                <p>I am a very simple card. I am good at containing small bits of information. I am convenient because I require little markup to use effectively.</p>
            </div>
          </div>
        </div>`;
        };

        const popoverOptions = {
            container: 'body',
            placement: 'top',
            trigger: 'click',
            html: true,
            content: generatePopover
        };

        $('[data-toggle="popover"]').popover(popoverOptions);
        $('[data-toggle="popover"]').on('shown.bs.popover', function() {
            const $this = $(this);
            const currentChord = $this.data('chord');
            const $popover = $('.popover');
            const jTabArea = $popover.find('.jTabArea');
            const cardContent = $popover.find('.card-content');
            cardContent.prepend(
                `<span class="card-title">${currentChord}</span>`
            );
            jTab.render(jTabArea, currentChord);
        });
    });
};

main(window);
