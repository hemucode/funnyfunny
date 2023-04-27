window['monsterDependenciesLoaded'] = !![];
if (typeof addMonster === 'undefined' || !addMonster) {
    var USE_DEFAULT_MONSTER = ![], LEFT_KEY = 37, UP_KEY = 38, RIGHT_KEY = 39, DOWN_KEY = 40, DOWN_KEY = 40, MAX_MONSTER = 100, kFloorHeight = USE_DEFAULT_MONSTER ? 10 : 2;
    $('<div id="codehemu-monster-floor"><div/>')['addClass']('floor')['appendTo']($('body'));
    function getScrollParent(a, b) {
        if (a == null)
            return null;
        var c = getComputedStyle(a), d = c['position'] === 'absolute', e = b ? /(auto|scroll|hidden)/ : /(auto|scroll)/;
        if (c['position'] === 'fixed')
            return a;
        for (var f = a; f = f['parentElement'];) {
            c = getComputedStyle(f);
            if (d && c['position'] === 'static')
                continue;
            if (c['position'] === 'fixed' || e['test'](c['overflow'] + c['overflowY'] + c['overflowX']))
                return f;
        }
        return document['body'];
    }
    function is_collideable(a, b) {
        if ([
                'VIDEO',
                'IMG',
                'INPUT'
            ]['indexOf']($(this)['prop']('tagName')) != -1)
            return !![];
        if (['HTML']['indexOf']($(this)['prop']('tagName')) != -1)
            return ![];
        if ($(this)['hasClass']('codehemu-monster-hitbox'))
            return !![];
        var c = $(this)['contents']()['not']($(this)['children']())['filter'](function () {
            return this['nodeType'] === 3;
        })['text']()['replace'](/\s+/g, '');
        return c != '';
    }
    function setSleepMonster(a) {
        USE_DEFAULT_MONSTER ? a['children']('.codehemu-monster-hitbox')['children']('.codehemu-monster-text')['html']('&#' + (128513 + 34) + ';') : a['children']('.codehemu-monster-hitbox')['children']('img')['attr']('src', chrome['runtime']['getURL']('monster/1f634.png'));
    }
    function randomizeMonster(a) {
        USE_DEFAULT_MONSTER ? a['children']('.codehemu-monster-hitbox')['children']('.codehemu-monster-text')['html']('&#' + (128513 + Math['floor'](Math['random']() * (128567 - 128513))) + ';') : a['children']('.codehemu-monster-hitbox')['children']('img')['attr']('src', chrome['runtime']['getURL']('monster/1f6' + ('0' + Math['floor'](Math['random']() * 62))['slice'](-2) + '.png'));
    }
    function initializeMonster(a) {
        a['html'](''), a['append']($('<div/>')['addClass']('codehemu-monster-hitbox')), USE_DEFAULT_MONSTER ? a['children']('.codehemu-monster-hitbox')['append']($('<div/>')['addClass']('codehemu-monster-text')) : a['children']('.codehemu-monster-hitbox')['append']($('<img>')), randomizeMonster(a), a['css']('left', $(window)['scrollLeft']() + Math['floor'](window['innerWidth'] / 2)), a['css']('top', $(window)['scrollTop']() + Math['floor'](window['innerHeight'] / 2));
    }
    var rightMargin = USE_DEFAULT_MONSTER ? 20 : 10;
    function enforcePositionContraints(a, b, c) {
        var d = $(window)['scrollTop'](), e = $(window)['scrollLeft'](), f = d + (document['doctype']['name'] == 'html' ? $(window)['height']() : window['innerHeight']), g = e + (document['doctype']['name'] == 'html' ? $(window)['width']() : window['innerWidth']), h = ![];
        if (c < d)
            c = d;
        else
            c + a['outerHeight']() > f - kFloorHeight && (c = f - a['outerHeight']() - kFloorHeight, h = !![]);
        if (b < e)
            b = e;
        else
            b + a['outerWidth']() > g - rightMargin && (b = g - a['outerWidth']() - rightMargin);
        return {
            'y': c,
            'x': b,
            'jump_allowed': h
        };
    }
    function findPetBox() {
        for (var a = 0; a < MAX_MONSTER; a++) {
            if ($('#codehemu-monster-box-' + a)['size']() == 0)
                return a;
        }
        return -1;
    }
    function addMonster() {
        var a = k(MAX_MONSTER);
        if (a === null)
            return;
        var b = a['parent']();
        initializeMonster(a);
        var c = Math['floor'](10 * Math['random']()), d = -10, e = 0, f = {
                'LEFT_KEY': ![],
                'UP_KEY': ![],
                'RIGHT_KEY': ![],
                'DOWN_KEY': ![]
            }, g = ![], h = [
                'IMG',
                'TEXTAREA',
                'BR',
                'VIDEO',
                'INPUT',
                'path',
                'svg',
                'g',
                'IFRAME'
            ], i = null, j = !![];
        function k() {
            monster_index = findPetBox();
            if (monster_index == -1)
                return null;
            var y = 'codehemu-monster-box-' + monster_index, z = $('<div/>')['attr']('id', y)['addClass']('codehemu-monster-box')['appendTo'](document['body']), A = 'monster-' + monster_index, B = $('<div/>')['attr']('id', A)['addClass']('monster')['appendTo'](z);
            return B['draggable']({
                'stack': '.monster',
                'scroll': ![],
                'stop': function (C, D) {
                    c = 0, d = 0, g = ![], j = !![];
                }
            }), B;
        }
        function l() {
            for (var y = LEFT_KEY; y < DOWN_KEY; y++) {
                var z = Math['random'](), A = 0.02;
                y == UP_KEY && (A = f[UP_KEY] ? 0.05 : 0.012), z < A && (f[y] = !f[y], z < 0.003 && (j && randomizeMonster(a))), !j && Math['random']() > 0.94 && (f[y] = ![]);
            }
            if (j && Math['random']() > 0.994 && d == 0 && c == 0)
                j = ![];
            else
                !j && Math['random']() > 0.9994 && (j = !![], randomizeMonster(a));
        }
        var m = USE_DEFAULT_MONSTER ? '.codehemu-monster-text' : 'img';
        function n() {
            var y = '';
            if (f[RIGHT_KEY] && !f[LEFT_KEY])
                y = 'rotate(30deg)';
            else
                f[LEFT_KEY] && !f[RIGHT_KEY] ? y = 'rotate(-30deg)' : transforme = 'none';
            a['children']()['children'](m)['css']('-webkit-transform', y);
        }
        function o(y) {
            if (f[RIGHT_KEY] && !f[LEFT_KEY])
                c = 4;
            else {
                if (f[LEFT_KEY] && !f[RIGHT_KEY])
                    c = -4;
                else {
                    if (c > 0)
                        c = Math['max'](c - 1, 0);
                    else
                        c < 0 && (c = Math['min'](c + 1, 0));
                }
            }
            f[UP_KEY] && g && j && (d = -10, g = ![]);
            if (a['is']('.ui-draggable-dragging')) {
            } else
                j ? d += 0.8 * y : d = 0, d > 9 && (d = 9), d < -9 && (d = -9), c > 9 && (c = 9), c < -9 && (c = -9);
        }
        var p = 1;
        function q(y, z) {
            var A = y - $(window)['scrollLeft']() + a['width']() / 2, B = z - $(window)['scrollTop']() + a['height']() + p, C = document['elementFromPoint'](A, B);
            B > window['innerHeight'] - kFloorHeight && (C = document['getElementById']('codehemu-monster-floor'));
            var D = a['offset']();
            if (C != i) {
                i = C;
                $['contains'](a['get'](0), C) && (C = document['body'], p += 1);
                C != null && (C = getScrollParent(C, ![]));
                if (C != b['parent']()[0] && C != null && h['indexOf']($(C)['prop']('tagName')) == -1) {
                    b['appendTo'](C);
                    var E = a['offset']()['top'], F = a['offset']()['left'];
                    a['offset'](D), actual_y = a['offset']()['top'], actual_x = a['offset']()['left'], (~~actual_y != ~~D['top'] || ~~actual_x != ~~D['left']) && (console['log']('Bad teleport'), console['log'](C), console['log'](D['left'] + '->' + actual_x + ' ,' + D['top'] + '->' + actual_y));
                }
            }
        }
        function r() {
            var y = a['offset']()['top'], z = a['offset']()['left'], A = a['outerWidth'](), B = a['outerHeight'](), C = [];
            for (var D = 0; D < 2; D++) {
                for (var E = 0; E < 2; E++) {
                    var F = z - $(window)['scrollLeft']() - 1 + D * (A + 2), G = y - $(window)['scrollTop']() + E * B - D, H = document['elementFromPoint'](F, G);
                    H != null && C['indexOf'](H) == -1 && C['push'](H);
                    ;
                }
            }
            return $(C);
        }
        var s = [
                -1,
                1,
                -1,
                1
            ], t = [
                'left',
                'left',
                'top',
                'top'
            ];
        function u(y, z) {
            var A = a['outerWidth'](), B = a['outerHeight'](), C = $(z), D = C['offset'](), E = {
                    'left': parseInt(D['left'], 10),
                    'top': parseInt(D['top'], 10)
                }, F = {
                    'width': parseInt(C['outerWidth'](), 10),
                    'height': parseInt(C['outerHeight'](), 10)
                }, G = [], H = a['offset'](), I = parseInt(H['left'], 10), J = parseInt(H['top'], 10);
            G['push'](I + A - E['left']), G['push'](E['left'] + F['width'] - I), G['push'](J + B - E['top']), G['push'](E['top'] + F['height'] - J);
            var K = 0, L = 0, M = -1;
            for (var N = 0; N < 4; N++) {
                (M == -1 || G[N] < K) && (K = G[N], M = N);
            }
            return response = {
                'left': 0,
                'top': 0,
                'overlapped': K >= 0
            }, K >= 0 && (M == 2 && (g = !![]), response[t[M]] = s[M] * K / 2), response;
        }
        function v(y) {
            var z = y['reduce'](function (D, E) {
                return {
                    'overlapped': D['overlapped'] + E['overlapped'],
                    'left': D['left'] + E['left'],
                    'top': D['top'] + E['top']
                };
            }, {
                'left': 0,
                'top': 0,
                'overlapped': 0
            });
            if (z['overlapped'])
                for (const D in z) {
                    if (D == 'overlapped')
                        continue;
                    var A = 1 * z[D] / z['overlapped'], B = parseInt(a['css'](D), 10), C = B + A;
                    a['css'](D, ~~C + 'px');
                }
            else
                !j && (j = !![], randomizeMonster(a));
        }
        var w = Date['now']();
        function x() {
            var z = Date['now'](), A = (z - w) / 30;
            if (A <= 0)
                return;
            w = z, l(), n(), o(A);
            var B = a['offset']()['top'], C = a['offset']()['left'], D = enforcePositionContraints(a, C + c * A, B + d * A);
            g = g || D['jump_allowed'];
            var E = D['y'], F = D['x'];
            c = (F - C) / A, d = (E - B) / A;
            if (!a['is']('.ui-draggable-dragging')) {
                a['offset']({
                    'left': F,
                    'top': E
                });
                if (j || Math['random']() > 0.95) {
                    q(F, E);
                    var G = ![], H = r()['not']('iframe, :hidden, .codehemu-monster-hitbox')['not'](a['children']())['not'](a['children']()['children']())['filter'](is_collideable)['map'](u)['get']();
                    v(H);
                }
            }
            var I = a['offset']()['top'], J = a['offset']()['left'];
            c = (J - C) / A, d = (I - B) / A;
        }
        a['get'](0)['animation_task'] = x, !window['timestep'] && (window['timestep'] = function () {
            $('.monster')['map'](function (y, z) {
                z['animation_task']();
            }), window['requestAnimationFrame'](window['timestep']);
        }, window['timestep']()), $('.codehemu-monster-quit')['length'] == 0 && ($('<button/>')['attr']('id', 'codehemu-monster-quit-button')['addClass']('codehemu-monster-quit')['click'](function () {
            $('.codehemu-monster-box')['remove'](), $('.codehemu-monster-quit')['remove'](), $('.codehemu-monster-plus')['remove'](), $('.codehemu-monster-min')['remove']();
        })['appendTo'](document['body']), $('<button/>')['attr']('id', 'codehemu-monster-plus-button')['addClass']('codehemu-monster-plus')['click'](function () {
            width = document['querySelectorAll']('.monster img')[0]['width'], new_width = width + 2, monster = document['querySelectorAll']('.monster img');
            for (allMonster of monster) {
                allMonster['style']['width'] = new_width + 'px', allMonster['style']['height'] = new_width + 'px';
            }
        })['appendTo'](document['body']), $('<button/>')['attr']('id', 'codehemu-monster-min-button')['addClass']('codehemu-monster-min')['click'](function () {
            width = document['querySelectorAll']('.monster img')[0]['width'], new_width = width - 2, monster = document['querySelectorAll']('.monster img');
            for (allMonster of monster) {
                allMonster['style']['width'] = new_width + 'px', allMonster['style']['height'] = new_width + 'px';
            }
        })['appendTo'](document['body']));
    }
}
addMonster();