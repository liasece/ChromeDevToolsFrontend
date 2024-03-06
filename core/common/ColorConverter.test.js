// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as Common from './common.js';
function assertAlmostEqual(array1, array2, delta = 0.01) {
    const almostEqual = array1.every((n, i) => {
        return Math.abs(n - array2[i]) < delta;
    });
    assert.isTrue(almostEqual, `${array1} is not almost equal to ${array2} with delta ${delta}`);
}
describe('ColorConverter', () => {
    it('LabToXyzd50', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[100.0, 0.0, 0.0], [0.9642, 1.0, 0.8252]],
            [[33.0, 0.0, 0.0], [0.0727, 0.0754, 0.0622]],
            [[66.0, 0.0, 0.0], [0.3406, 0.3532, 0.2915]],
            [[20.0, -35.0, 45.0], [0.0134, 0.0299, -0.0056]],
            [[80.0, -60.0, 70.0], [0.3416, 0.5668, 0.0899]],
            [[35.0, 60.0, 70.0], [0.1690, 0.0850, -0.0051]],
            [[75.0, 45.0, -100.0], [0.6448, 0.4828, 1.7488]],
            [[75.0, 100.0, 80.0], [0.92, 0.4828, 0.0469]],
        ]; // red
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.labToXyzd50(input[0], input[1], input[2]), expected);
        }
    });
    it('XYZD50ToLab', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[0.9642, 1.0, 0.8252], [100.0, 0.0, 0.0]],
            [[0.0727, 0.0754, 0.0622], [33.0, 0.0, 0.0]],
            [[0.3406, 0.3532, 0.2915], [66.0, 0.0, 0.0]],
            [[0.0134, 0.0299, -0.0056], [20.0, -35.0, 45.0]],
            [[0.3416, 0.5668, 0.0899], [80.0, -60.0, 70.0]],
            [[0.1690, 0.0850, -0.0051], [35.0, 60.0, 70.0]],
            [[0.6448, 0.4828, 1.7488], [75.0, 45.0, -100.0]],
            [[0.92, 0.4828, 0.0469], [75.0, 100.0, 80.0]],
        ]; // red
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd50ToLab(input[0], input[1], input[2]), expected, 0.1);
        }
    });
    it('OklabToXyzd65', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[1.0, 0.0, 0.0], [0.9504559270516717, 1.0, 1.0890577507598784]],
            [
                [0.8664396115356694, -0.23388757418790818, 0.17949847989672985],
                [0.357584339383878, 0.715168678767756, 0.11919477979462598],
            ],
            [
                [0.4209136612058102, 0.16470430417002319, -0.10147178154592906],
                [0.1279775574172914, 0.06148383144929487, 0.20935510595451154],
            ],
            [
                [0.4806125447400232, 0.1440294785250731, 0.0688902950420287],
                [0.167625056565021, 0.09823806119130823, 0.03204123425728893],
            ],
            [
                [0.5197518277948419, -0.14030232755310995, 0.10767589774360209],
                [0.07718833433230218, 0.15437666866460437, 0.025729444777434055],
            ],
        ]; // green
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.oklabToXyzd65(input[0], input[1], input[2]), expected);
        }
    });
    it('XYZD65 to Oklab', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[0.9504559270516717, 1.0, 1.0890577507598784], [1, 0.0, 0.0]],
            [
                [0.357584339383878, 0.715168678767756, 0.11919477979462598],
                [0.8664396115356694, -0.23388757418790818, 0.17949847989672985],
            ],
            [
                [0.1279775574172914, 0.06148383144929487, 0.20935510595451154],
                [0.4209136612058102, 0.16470430417002319, -0.10147178154592906],
            ],
            [
                [0.167625056565021, 0.09823806119130823, 0.03204123425728893],
                [0.4806125447400232, 0.1440294785250731, 0.0688902950420287],
            ],
            [
                [0.07718833433230218, 0.15437666866460437, 0.025729444777434055],
                [0.5197518277948419, -0.14030232755310995, 0.10767589774360209],
            ], // green
        ];
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd65ToOklab(input[0], input[1], input[2]), expected);
        }
    });
    it('XYZD50ToD65', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[0.95047, 1.0, 1.0888], [0.95392, 1.00594, 1.439698]],
            [[0.412, 0.213, 0.019], [0.389938, 0.20384, 0.025982]],
            [[0.358, 0.715, 0.119], [0.33307, 0.714494, 0.1480589]],
            [[0.18, 0.072, 0.95], [0.23041847, 0.087602, 1.264587]],
            [[0.23, 0.107, 0.555], [0.252396, 0.113222, 0.73899]],
            [[0.114, 0.09, 0.087], [0.112348, 0.089496, 0.115299]],
        ];
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd50ToD65(input[0], input[1], input[2]), expected);
        }
    });
    it('XYZD65ToD50', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[0.95392, 1.00594, 1.439698], [0.95047, 1.0, 1.0888]],
            [[0.389938, 0.20384, 0.025982], [0.412, 0.213, 0.019]],
            [[0.33307, 0.714494, 0.1480589], [0.358, 0.715, 0.119]],
            [[0.23041847, 0.087602, 1.264587], [0.18, 0.072, 0.95]],
            [[0.252396, 0.113222, 0.73899], [0.23, 0.107, 0.555]],
            [[0.112348, 0.089496, 0.115299], [0.114, 0.09, 0.087]],
        ];
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd65ToD50(input[0], input[1], input[2]), expected);
        }
    });
    it('XYZD50TosRGBLinear', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0, 0, 0]],
            [[0.95047, 1.0, 1.0888], [0.8272854669134366, 1.0223971188142922, 1.3696152053494186]],
            [[0.412, 0.213, 0.019], [0.9374275777784716, 0.005542826192671772, 0.007585345113415052]],
            [[0.358, 0.715, 0.119], [-0.09280883353574096, 1.0237151633684942, 0.0292858777069627]],
            [[0.18, 0.072, 0.95], [-0.01841380331752207, -0.006427604489910602, 1.3315858423930542]],
            [[0.23, 0.107, 0.555], [0.27548326260231637, -0.0015117957032871887, 0.772043362443567]],
            [[0.114, 0.09, 0.087], [0.16903835776528245, 0.06379397130440126, 0.10986584693282563]],
        ];
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd50TosRGBLinear(input[0], input[1], input[2]), expected);
        }
    });
    it('LchToLab', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[89.11, 69.04, 161.5], [89.11, -65.472265155436, 21.906713478207564]],
            [
                [29.6915239933531, 66.82572352143814, 327.1054738802461],
                [29.6915239933531, 56.11167248735513, -36.292665028011974],
            ],
            [
                [38.14895894517021, 59.598372928277406, 32.286662896162966],
                [38.14895894517021, 50.38364171345111, 31.834803335164764],
            ],
            [
                [46.27770902748027, 67.9842594463414, 134.3838583288382],
                [46.27770902748027, -47.55240796497723, 48.586294664234586],
            ],
        ]; // green
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.lchToLab(input[0], input[1], input[2]), expected);
        }
    });
    it('LabToLch', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[100.0, 0.0, 0.0], [100.0, 0.0, 0.0]],
            [[89.11, -65.472265155436, 21.906713478207564], [89.11, 69.04, 161.5]],
            [
                [29.6915239933531, 56.11167248735513, -36.292665028011974],
                [29.6915239933531, 66.82572352143814, -32.894523620605469],
            ],
            [
                [38.14895894517021, 50.38364171345111, 31.834803335164764],
                [38.14895894517021, 59.598372928277406, 32.286662896162966],
            ],
            [
                [46.27770902748027, -47.55240796497723, 48.586294664234586],
                [46.27770902748027, 67.9842594463414, 134.3838583288382],
            ],
        ]; // green
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.labToLch(input[0], input[1], input[2]), expected);
        }
    });
    it('SRGBLinearToXyzd50', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[1.0, 1.0, 1.0],
                [0.9642956660812443, 1.0000000361162846,
                    0.8251045485672053]],
            [[0.0, 1.0, 0.0],
                [0.3851514688337912, 0.7168870538238823,
                    0.09708128566574631]],
            [
                [0.37626212299090644, 0.02315336617811041, 0.02315336617811041],
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
            ],
            [[1.0, 0.5271151257058131, 0.5972017883637634], [0.7245316165924385, 0.6365774485679174, 0.4915583325045292]],
        ]; // pink
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.srgbLinearToXyzd50(input[0], input[1], input[2]), expected);
        }
    });
    it('SRGBToXyzd50', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[1.0, 1.0, 1.0],
                [0.9642956660812443, 1.0000000361162846,
                    0.8251045485672053]],
            [[0.0, 1.0, 0.0],
                [0.3851514688337912, 0.7168870538238823,
                    0.09708128566574631]],
            [
                [0.6470588235294118, 0.16470588235294117, 0.16470588235294117],
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
            ],
            [[1.0, 0.7529411764705882, 0.796078431372549], [0.7245316165924385, 0.6365774485679174, 0.4915583325045292]],
        ]; // pink
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.srgbToXyzd50(input[0], input[1], input[2]), expected);
        }
    });
    it('DisplayP3ToXyzd50', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [
                [0.9999999999999999, 0.9999999999999997, 0.9999999999999999],
                [0.9642956660812443, 1.0000000361162846, 0.8251045485672053],
            ],
            [
                [0.45840159019103005, 0.9852645833250543, 0.29829470783345835],
                [0.3851514688337912, 0.7168870538238823, 0.09708128566574631],
            ],
            [
                [0.5957181607237907, 0.2055939145569215, 0.18695695018247227],
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
            ],
            [
                [0.4584004101072638, 0.07977226603250179, 0.4847907338567859],
                [0.1250143560558979, 0.0611129099463755, 0.15715146562446167],
            ],
            [
                [0.962148711796773, 0.7628803605364196, 0.7971503318758075],
                [0.7245316165924385, 0.6365774485679174, 0.4915583325045292],
            ],
        ]; // pink
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.displayP3ToXyzd50(input[0], input[1], input[2]), expected);
        }
    });
    it('XYZD50ToDisplayP3', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [
                [0.9642956660812443, 1.0000000361162846, 0.8251045485672053],
                [0.9999999999999999, 0.9999999999999997, 0.9999999999999999],
            ],
            [
                [0.3851514688337912, 0.7168870538238823, 0.09708128566574631],
                [0.45840159019103005, 0.9852645833250543, 0.29829470783345835],
            ],
            [
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
                [0.5957181607237907, 0.2055939145569215, 0.18695695018247227],
            ],
            [
                [0.1250143560558979, 0.0611129099463755, 0.15715146562446167],
                [0.4584004101072638, 0.07977226603250179, 0.4847907338567859],
            ],
            [
                [0.7245316165924385, 0.6365774485679174, 0.4915583325045292],
                [0.962148711796773, 0.7628803605364196, 0.7971503318758075],
            ],
        ]; // pink
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd50ToDisplayP3(input[0], input[1], input[2]), expected);
        }
    });
    it('ProPhotoToXyzd50', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [
                [0.9999999886663737, 1.0000000327777285, 0.9999999636791804],
                [0.9642956660812443, 1.0000000361162846, 0.8251045485672053],
            ],
            [
                [0.5402807890930262, 0.9275948938161531, 0.30456598218387576],
                [0.3851514688337912, 0.7168870538238823, 0.09708128566574631],
            ],
            [
                [0.4202512875251534, 0.20537448341387265, 0.14018716364460992],
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
            ],
            [
                [0.3415199027593793, 0.13530888280806527, 0.3980101298732242],
                [0.1250143560558979, 0.0611129099463755, 0.15715146562446167],
            ],
            [
                [0.8755612852965058, 0.7357597566543541, 0.7499575746802042],
                [0.7245316165924385, 0.6365774485679174, 0.4915583325045292],
            ],
        ]; // pink
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.proPhotoToXyzd50(input[0], input[1], input[2]), expected);
        }
    });
    it('XYZD50ToProPhoto', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [
                [0.9642956660812443, 1.0000000361162846, 0.8251045485672053],
                [0.9999999886663737, 1.0000000327777285, 0.9999999636791804],
            ],
            [
                [0.3851514688337912, 0.7168870538238823, 0.09708128566574631],
                [0.5402807890930262, 0.9275948938161531, 0.30456598218387576],
            ],
            [
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
                [0.4202512875251534, 0.20537448341387265, 0.14018716364460992],
            ],
            [
                [0.1250143560558979, 0.0611129099463755, 0.15715146562446167],
                [0.3415199027593793, 0.13530888280806527, 0.3980101298732242],
            ],
            [
                [0.7245316165924385, 0.6365774485679174, 0.4915583325045292],
                [0.8755612852965058, 0.7357597566543541, 0.7499575746802042],
            ],
        ]; // pink
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd50ToProPhoto(input[0], input[1], input[2]), expected);
        }
    });
    it('AdobeRGBToXyzd50', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [
                [1.0000000000000002, 0.9999999999999999, 1.],
                [0.9642956660812443, 1.0000000361162846, 0.8251045485672053],
            ],
            [
                [0.564972265988564, 0.9999999999999999, 0.23442379872902916],
                [0.3851514688337912, 0.7168870538238823, 0.09708128566574631],
            ],
            [
                [0.5565979160264471, 0.18045907254050694, 0.18045907254050705],
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
            ],
            [
                [0.4275929819700999, 0.0, 0.4885886519419426],
                [0.1250143560558979, 0.0611129099463755, 0.15715146562446167],
            ],
            [
                [0.9363244100721754, 0.7473920857106169, 0.7893042668092753],
                [0.7245316165924385, 0.6365774485679174, 0.4915583325045292],
            ],
        ]; // pink
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.adobeRGBToXyzd50(input[0], input[1], input[2]), expected);
        }
    });
    it('XYZD50ToAdobeRGB', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [
                [0.9642956660812443, 1.0000000361162846, 0.8251045485672053],
                [1.0000000000000002, 0.9999999999999999, 1.],
            ],
            [
                [0.3851514688337912, 0.7168870538238823, 0.09708128566574631],
                [0.564972265988564, 0.9999999999999999, 0.23442379872902916],
            ],
            [
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
                [0.5565979160264471, 0.18045907254050694, 0.18045907254050705],
            ],
            [
                [0.1250143560558979, 0.0611129099463755, 0.15715146562446167],
                [0.4275929819700999, 0.0, 0.4885886519419426],
            ],
            [
                [0.7245316165924385, 0.6365774485679174, 0.4915583325045292],
                [0.9363244100721754, 0.7473920857106169, 0.7893042668092753],
            ],
        ]; // pink
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd50ToAdobeRGB(input[0], input[1], input[2]), expected);
        }
    });
    it('Rec2020ToXyzd50', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[1.0000000000000002, 1., 1.],
                [0.9642956660812443, 1.0000000361162846,
                    0.8251045485672053]],
            [
                [0.5675424725933591, 0.959278677099374, 0.2689692617052188],
                [0.3851514688337912, 0.7168870538238823, 0.09708128566574631],
            ],
            [
                [0.4841434514625542, 0.17985588424119636, 0.12395667053434403],
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
            ],
            [
                [0.36142160262090384, 0.0781562275109019, 0.429742223818931],
                [0.1250143560558979, 0.0611129099463755, 0.15715146562446167],
            ],
            [
                [0.9098509851821579, 0.747938726996672, 0.7726929727190115],
                [0.7245316165924385, 0.6365774485679174, 0.4915583325045292],
            ],
        ]; // pink
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.rec2020ToXyzd50(input[0], input[1], input[2]), expected);
        }
    });
    it('XYZD50ToRec2020', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[0.9642956660812443, 1.0000000361162846, 0.8251045485672053], [1.0000000000000002, 1., 1.]],
            [
                [0.3851514688337912, 0.7168870538238823, 0.09708128566574631],
                [0.5675424725933591, 0.959278677099374, 0.2689692617052188],
            ],
            [
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
                [0.4841434514625542, 0.17985588424119636, 0.12395667053434403],
            ],
            [
                [0.1250143560558979, 0.0611129099463755, 0.15715146562446167],
                [0.36142160262090384, 0.0781562275109019, 0.429742223818931],
            ],
            [
                [0.7245316165924385, 0.6365774485679174, 0.4915583325045292],
                [0.9098509851821579, 0.747938726996672, 0.7726929727190115],
            ],
        ]; // pink
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd50ToRec2020(input[0], input[1], input[2]), expected);
        }
    });
    it('Xyzd50ToSrgb', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[1.0, 1.0, 1.0],
                [0.9642956660812443, 1.0000000361162846,
                    0.8251045485672053]],
            [[0.0, 1.0, 0.0],
                [0.3851514688337912, 0.7168870538238823,
                    0.09708128566574631]],
            [
                [0.6470588235294118, 0.16470588235294117, 0.16470588235294117],
                [0.1763053229982614, 0.10171766135467991, 0.024020600356509242],
            ],
            [[1.0, 0.7529411764705882, 0.796078431372549], [0.7245316165924385, 0.6365774485679174, 0.4915583325045292]],
            [[-3.82, 8.124, 7.752], [60, 100, 100]], // Out of gamut for sRGB but still out
        ]; // pink
        for (const [expected, input] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd50ToSrgb(input[0], input[1], input[2]), expected);
        }
    });
    it('xyzd50ToOklch', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[0.387, 0.719, 0.098], [0.8673558615881383, 0.2943827914193604, 142.46721129661893]],
            [[0.125, 0.061, 0.157], [0.4207236956831411, 0.19379111721542183, -31.581090643953534]],
            [[0.171, 0.102, 0.027], [0.4801470749600788, 0.15014832987216517, 25.62722827644009]],
            [[0.083, 0.155, 0.021], [0.5199709382011207, 0.17740395353498845, 142.60633091326085]],
        ]; // green
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.xyzd50ToOklch(input[0], input[1], input[2]), expected);
        }
    });
    it('oklchToXyzd50', () => {
        const colorCases = [
            [[0.0, 0.0, 0.0], [0.0, 0.0, 0.0]],
            [[0.8664396115356694, 0.2948272403370167, 142.49533888780996], [0.387, 0.719, 0.098]],
            [[0.4209136612058102, 0.19345291484554133, 328.36341792345144], [0.125, 0.061, 0.157]],
            [[0.4806125447400232, 0.1596570181206647, 25.562112067668068], [0.171, 0.102, 0.027]],
            [[0.5197518277948419, 0.17685825418032036, 142.4953388878099], [0.083, 0.155, 0.021]],
        ]; // green
        for (const [input, expected] of colorCases) {
            assertAlmostEqual(Common.ColorConverter.ColorConverter.oklchToXyzd50(input[0], input[1], input[2]), expected);
        }
    });
});
//# sourceMappingURL=ColorConverter.test.js.map