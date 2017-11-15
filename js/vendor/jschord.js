/*
 * First pass at a Javascript guitar chord finder.
 *
 * 23 May 05  Erich Rickheit KSC     Essentially a C translation
 *
 * Copyright 2005 Erich Rickheit. Permission is granted to use this
 * code as is, as long as this copyright notice is retained.
 * Permission is granted to modify this code, as long as this
 * copyright notice is retained and modifications are clearly marked.
 * All other rights are reserved to the author.
 */

// kinds of intervals
var TPERFECT = 1;
var TMAJOR = 2;
var TMINOR = 3;
var TAUGMENTED = 4;
var TDIMINISHED = 5;

var intervals = [
    /* none        */ [],
    /*      1  2  3  4  5  6    7   8   9  10  11  12  13  14 */
    /* PERFECT    */ [-1, 0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24],
    /* MAJOR      */ [-1, 0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24],
    /* MINOR      */ [-1, 0, 1, 3, 4, 6, 8, 10, 12, 13, 14, 16, 19, 20, 22, 24],
    /* AUGMENTED  */ [
        -1,
        1,
        3,
        5,
        6,
        8,
        10,
        12,
        13,
        15,
        17,
        18,
        20,
        22,
        24,
        25
    ],
    /* DIMINISHED */ [-1, -1, 0, 2, 4, 6, 7, 9, 11, 12, 14, 16, 18, 19, 21, 23]
];

// images of strings
var imgLeftOpen =
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojH+gyQH9THQLWanmbGjL6zkgmHHmZ4XqmJZox8JpfFKVOOfyXqtZAQA7';
var imgMidOpen =
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIpjH+gyQH9THQLIYWrs9vOdnGflGTa2IWeyK6SOaFyq9YgHNPgTro1XgAAOw==';
var imgRightOpen =
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojH+gyQH9THQLIVWvdXs2bXlSgnVmeILqh4kcCq9jzJb0LL+5O7VHAQA7';

var imgLeftUnplayed =
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAInjG9wmsGLnGw0IoDfg3FXflmek4Hmh05hJ5bpCIsy27nqeb/zemUFADs=';
var imgMidUnplayed =
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojG9wmsGLnGw0OoAzjG+jXnleRorhOX0WmJIaysbrzC3uI9e6uo93AQA7';
var imgRightUnplayed =
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojG9wmsGLnGw0OoDtg3FXjnjTlXXaaaYhSoouC8ZfhZWrKo/5m9RHAQA7';

var imgLeft = [
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAInjI+py70AwZEozkhxxpdOxRnel4wiiJagdapulcJv55mBjcekXEUFADs=',
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojI+py70AwZGJIjsVNjv0aG3RBHKld6KiNnLaW8GXTEJZjM/5rV9RAQA7',
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojI+py70AwZGJIjsVNjv0aH3aWJGXFmUXNIGc68Hx9qWcqZ7lrq9QAQA7',
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojI+py70AwZGJIjsVNjv0aH3aWJGXFmXlerJqe6VcBU0gd3u5vn1RAQA7'
];

var imgMid = [
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojI+py40AIzjzQSqNrBtX6mWa8oFJOZ5kGJnPqsavvF3pjLv67dZAAQA7',
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIqjI+py40AIzgz1acuzdzIuD0QJXll8JEaqp6s1WHwLKPftb51uHvxDSgAADs=',
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojI+py40AIzgz1acuzdzIuFkdJpZk8EEhpXqSC6IvbKaX5o3rntdpAQA7',
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojI+py40AIzgz1acuzdzIuFkdJpZk8EHhubbeuKaXhqqedIO1vptyAQA7'
];

var imgRight = [
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAInjI+py40AgZIPnmgDpvvm631gQj3TSaJapI5mCr8y1hqli9u1FpYFADs=',
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAIojI+py40AgZKJvolrDtEez0FfZ3SUOYIWqbWX+21xGcmlzeFgTotGAQA7',
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAImjI+py40AgZKJvolrDtEeb4Dc9pHhF5lp2LFrZ62lK9bmqOUXfRQAOw==',
    'data:image/gif;base64,R0lGODlhBwAoAIAAAAAAAP///yH5BAEKAAEALAAAAAAHACgAAAInjI+py40AgZKJvolrDtEeb4Dc9pHhF5mjxl5tGaYvB6FyR+F22x0FADs='
];

// maps note names to half-steps
var steps = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };

// a global error location
var errpar;

function err_mesg(mesg) {
    if (errpar == null) errpar = mesg;
}

var stringbase = [4, 9, 2, 7, 11, 4]; // notes on each open string
var applicableChords;

function findVoice(chordname) {
    // start by parsing the chord
    var chordval = parse_chord(chordname.value);
    if (!chordval) {
        return [];
    }

    // turn intervals into note numbers (half-steps above C)
    var notevals = new Array();
    notevals.push(chordval.root);
    for (var i = 2; i < 16; i++) {
        if (chordval[i] <= 0) continue;
        if (chordval[i] == null) continue;
        var val = chordval.root + intervals[chordval[i]][i];

        // confine to first octave
        while (val >= 12) val -= 12;
        while (val < 0) val += 12;

        notevals.push(val);
    }
    notevals.bassnote = chordval.bassnote;

    var fingering = new Array();
    for (i = 1; i <= 6; i++) {
        fingering.push(-1);
    }

    applicableChords = new Array();

    // start looking
    consider_string(fingering, notevals, 0);

    // put results into order
    applicableChords.sort(function(a, b) {
        var res;

        res = a.min - b.min; // closer to the nut show up earlier
        if (res != 0) return res;

        res = a.unplayed - b.unplayed; // fewer unplayed strings earlier
        if (res != 0) return res;

        res = b.open - a.open; // more open strings earlier
        if (res != 0) return res;

        return res;
    });

    return applicableChords;
}

// does the fingering play the chord
function check_match(fingering, notes) {
    var note;
    var i;

    // every note in the chord must be played
    for (note = 0; note < notes.length; note++) {
        var played = false;
        for (i = 0; i < fingering.length; i++) {
            if (fingering[i] < 0) continue; // ignore unplayed strings
            pitch = stringbase[i] + fingering[i];
            while (pitch >= 12) pitch -= 12;
            while (pitch < 0) pitch += 12;
            if (pitch == notes[note]) {
                played = true;
                break;
            }
        }

        // note wasn't played on any string
        if (!played) return;
    }

    // if there's a bass note, it must be on the lowest string
    if (notes.bassnote != null) {
        for (i = 0; i < fingering.length; i++) {
            if (fingering[i] < 0) continue; // ignore unplayed strings
            pitch = stringbase[i] + fingering[i];
            while (pitch >= 12) pitch -= 12;
            while (pitch < 0) pitch += 12;
            if (pitch == notes.bassnote) break; // OK, that's it
            return; // wasn't on the lowest played string
        }
    }

    // guess it's a chord; emit it
    /*
  note = 'match:';
  for (i=0; i<fingering.length; i++)
    note = note + ' ' + fingering[i];
  err_mesg(note);
  */

    // create a result
    var res = new Array();
    var max = 0;
    var min = 1000;
    res.unplayed = res.open = 0;
    for (i = 0; i < fingering.length; i++) {
        res[i] = fingering[i];
        if (fingering[i] > 0 && fingering[i] > max) max = fingering[i];
        if (fingering[i] > 0 && fingering[i] < min) min = fingering[i];
        if (fingering[i] < 0) res.unplayed++;
        if (fingering[i] == 0) res.open++;
    }
    if (max < 5) min = 1;
    res.min = min;
    applicableChords.push(res);
}

// recursively tries to find the notes on the strings
function consider_string(fingering, notes, string) {
    var note;
    var pos;
    var count;
    var i;

    // hey, did we find one?
    check_match(fingering, notes);
    if (string >= fingering.length) return;

    // try to find each note on this string
    Note: for (note = 0; note < notes.length; note++) {
        // find it, normalize to first octave
        pos = notes[note] - stringbase[string];
        while (pos < 0) pos += 12;
        while (pos > 11) pos -= 12;

        // err_mesg('placing '+ notes[note] + ' on string '+ string +', fret '+pos);

        // string is fretted
        if (pos > 0) {
            // how many strings are currently fretted?
            for (i = count = 0; i < string; i++) if (fingering[i] > 0) count++;

            if (count >= 3) {
                // four fingers
                // would fail for an open chord -- what about a barre?

                // find lowest fretted string; that's the barre
                var barre = pos;
                for (i = 0; i < string; i++) {
                    // a barre can't have any open strings
                    if (fingering[i] == 0) continue Note;
                    if (fingering[i] < 0) continue; // ignore unplayed strings
                    if (fingering[i] < barre) barre = fingering[i];
                }

                // now, count strings fretted above the barre
                for (i = count = 0; i < string; i++)
                    if (fingering[i] > barre) count++;
                if (pos > barre) count++;

                // four fingers, index finger is barring
                if (count > 3) continue Note;
            }

            // is the reach between strings too great?
            var min = pos;
            var max = pos;
            for (i = 0; i < string; i++) {
                if (fingering[i] > 0 && fingering[i] > max) max = fingering[i];
                if (fingering[i] > 0 && fingering[i] < min) min = fingering[i];
            }

            // we can reach 4 frets
            if (max - min > 3) continue Note;
        }

        // OK, no reason to fail
        fingering[string] = pos;
        consider_string(fingering, notes, string + 1);
        fingering[string] = -1;
    }

    // try this string unplayed?
    for (i = 0; i < string; i++) if (fingering[i] >= 0) return; // can't if any below are played
    fingering[string] = -1;
    consider_string(fingering, notes, string + 1);
}

// a simple recursive-descent parser for chord names
function parse_chord(name) {
    // split the string into an array of characters
    var inbuf = new Array();
    for (var i = 0; i < name.length; i++) {
        var ch = name.charAt(i);
        if (ch == ' ' || ch == '\t' || ch == '\r' || ch == '\n') continue;
        inbuf.push(ch.toLowerCase());
    }

    // a place to put our result
    var rchord = new Object();

    // first thing is the root note
    if ((rchord.root = parse_note(inbuf)) < 0) return null;

    // build the major triad
    rchord[3] = TMAJOR;
    rchord[5] = TPERFECT;

    // variations come afterward
    if (!parse_minor(inbuf, rchord)) return null;
    if (!parse_mods(inbuf, rchord)) return null;
    if (!parse_bass(inbuf, rchord)) return null;

    // some of the string was left unparsed
    if (inbuf.length > 0 && inbuf[0] != 0) return null;

    return rchord;
}

// looks for a note; returns its numeric value, or -1 on failure
function parse_note(inbuf, rchord) {
    // easy check for non-note
    if (inbuf.length <= 0) return -1;
    if (inbuf[0] < 'a' || inbuf[0] > 'g') return -1;

    // consume it, convert to a number of half-steps
    var note = inbuf.shift();
    note = steps[note];

    // a group of sharps
    if (inbuf[0] == '#') {
        while (inbuf[0] == '#') {
            inbuf.shift();
            note++;
        }
        if (note >= 12) note -= 12;
    } else if (inbuf[0] == 'b' || inbuf[0] == '!') {
        // or a group of flats (can't have both)
        while (inbuf[0] == 'b' || inbuf[0] == '!') {
            inbuf.shift();
            note--;
        }
        if (note < 0) note += 12;
    }

    return note;
}

// check if a chord is identified as a minor. Returns false on error
function parse_minor(inbuf, rchord) {
    // quick check
    if (inbuf[0] != 'm') return true;

    // but don't be fooled by a 'maj' notation
    if (inbuf[1] == 'a' && inbuf[2] == 'j') return true;

    // consume that notation
    inbuf.shift();

    // accept 'min' as well
    if (inbuf[0] == 'i' && inbuf[1] == 'n') {
        inbuf.shift();
        inbuf.shift();
    }

    // turn a major third into a minor third
    rchord[3] = TMINOR;

    return true;
}

// just a list of zero or more mods; returns false on error
function parse_mods(inbuf, rchord) {
    var res;

    while ((res = parse_mod(inbuf, rchord))) if (res < 0) return false;
    return true;
}

// parse a single modification to the chord;
// returns 1 if a mod is found, 0 if none found, -1 on an error
function parse_mod(inbuf, rchord) {
    var n;

    switch (inbuf[0]) {
        case 'a':
            if (inbuf.length < 3) return 0;
            if (inbuf[1] == 'd' && inbuf[2] == 'd') {
                // Cadd7
                inbuf.splice(0, 3); // consume the 'add'
                if (!(n = parse_number(inbuf))) {
                    err_mesg('No interval to add');
                    return -1;
                }
                if (rchord[n] > 0) {
                    err_mesg('interval ' + n + ' already in chord');
                    return -1;
                }

                // mark the added interval
                rchord[n] = TMAJOR;
                return 1;
            }

            // augmented interval, same as the cases below
            if (!(inbuf[1] == 'u' && inbuf[2] == 'g')) return 0;
            inbuf.shift();
            inbuf.shift();

        case '+':
        case '#': // augmented interval
            inbuf.shift();
            if (!(n = parse_number(inbuf))) n = 5; // defaults to augmented fifth
            rchord[n] = TAUGMENTED;
            return 1;

        case '-':
        case 'b': // lowered interval
            inbuf.shift();
            if (!(n = parse_number(inbuf))) n = 5; // defaults to diminished fifth
            rchord[n] = TMINOR;
            return 1;
        // OK, we _should_ 'minor' major interval and 'diminish' perfects...

        case 'd': // diminished
            if (inbuf.length < 3) return 0;
            if (!(inbuf[1] == 'i' && inbuf[2] == 'm')) return 0;
            inbuf.splice(0, 3); // consume the 'dim'

            if (!(n = parse_number(inbuf))) {
                // no number specified, a diminished chord

                rchord[3] = TMINOR;
                rchord[5] = TDIMINISHED;
                rchord[7] = TDIMINISHED;
                return 0;
            }

            // there was an interval to diminish
            rchord[n] = TDIMINISHED;
            return 1;

        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            n = parse_number(inbuf);

            if (n >= 7) {
                // we must also include a (minor) 7th
                if (!rchord[7]) rchord[7] = TMINOR;
            }

            // add the interval, if it's not there already
            if (!rchord[n]) rchord[n] = TMAJOR;

            // a special case: '6/9'
            if (n == 6 && inbuf[0] == '/' && inbuf[1] == '9') {
                inbuf.shift();
                inbuf.shift();
                if (!rchord[9]) rchord[9] = TMAJOR;
            }

            return 1;

        case 'm': // Cmaj7
            if (inbuf.length < 3) return 0;
            if (!(inbuf[1] == 'a' && inbuf[2] == 'j')) return 0;
            inbuf.splice(0, 3); // consume the 'maj'

            if (!(n = parse_number(inbuf))) n = 7; // default to major 7th
            rchord[n] = TMAJOR;
            return 1;

        case 's': // Csus
            if (inbuf.length < 3) return 0;
            if (!(inbuf[1] == 'u' && inbuf[2] == 's')) return 0;
            inbuf.splice(0, 3); // consume the 'sus'
            if (inbuf[0] == 'p') inbuf.shift(); // some write 'susp'

            if (!(n = parse_number(inbuf))) n = 4;
            if (!rchord[3]) {
                err_mesg('no third to suspend?');
                return -1;
            }
            rchord[n] = rchord[3];
            rchord[3] = 0;
            return 1;

        case '/': // might separate mods, might be a bass note
            if (inbuf[1] >= 'a' && inbuf[1] <= 'g') return 0;
            inbuf.shift();
            return parse_mod(inbuf, rchord); // parse the mod we find there

        case '(': // parens for grouping
            inbuf.shift();
            if (!parse_mods(inbuf, rchord)) return -1;
            if (inbuf[0] != ')') {
                err_mesg('unbalanced parentheses');
                return -1;
            }
            inbuf.shift();
            return 1;

        default:
            return 0;
    }

    // fallthrough; I dunno
    return -1;
}

// see if we've specified a root/bass note
function parse_bass(inbuf, rchord) {
    if (inbuf[0] != '/') return true;
    inbuf.shift();

    // only one is allowed
    if (rchord.bassnote != null) {
        err_mesg('bass note is already set :' + rchord.bassnote);
        return false;
    }

    if ((rchord.bassnote = parse_note(inbuf)) < 0) return false;

    return true;
}

// parse an interval number
function parse_number(inbuf) {
    var val = 0;

    if (inbuf[0] < '1' || inbuf[0] > '9') return 0;
    while (inbuf[0] >= '0' && inbuf[0] <= '9') {
        var ch;

        ch = inbuf.shift();
        val = val * 10 + +ch;
    }

    // limit return value to something moderately sensible
    if (val > 15) {
        err_mesg('disallowing intervals greater than a fifteenth');
        return 0;
    }
    return val;
}
