"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
// CONSTANTS
// ================================================================================================
const initialConstants = [
    1908230773479027697n, 11775995824954138427n, 11762118091073853017n, 1179928731377769464n
];
const roundConstants = [
    [
        3507676442884075254n, 14199898198859462402n, 9943771478517422846n, 5299008510059709046n,
        4876587438151046518n, 935380327644019241n, 11969155768995001697n, 8905176503159002610n,
        10209632462003885590n, 4094264109993537899n, 13783103540050167525n, 7244561326597804778n,
        13136579845459532606n, 5360204127205901439n, 17688104912985715754n, 13327045140049128725n,
        8381978233857855775n, 17173008252555749159n, 16851158199224461544n, 198447382074086442n,
        6525022393008508587n, 15123861172768054914n, 10416955771456577164n, 11131732656469473226n,
        2452137769288432333n, 4412015122616966251n, 11465432874127736482n, 5737914329229941931n,
        10297324169560390650n, 8193234160249188780n, 2724535690916515409n, 1291976646389720043n
    ], [
        17202444183124002971n, 17723456717189439036n, 3750639259183275092n, 7448158522061432535n,
        3164914583837294015n, 12646084612349376118n, 7395381026560285023n, 729218816014270996n,
        6265319720055610278n, 6560811038686569758n, 10193097109625174474n, 10009700032272605410n,
        5938544421064743176n, 12280906544861631781n, 8456857679341924027n, 11348815465318493332n,
        6252463877627126306n, 13030052548815547650n, 10857148724261265034n, 12423114749217998360n,
        2246658437530714125n, 11512829271452903113n, 4058847408561007989n, 7479642583779880883n,
        13859809880585885275n, 8887260856005721590n, 16705356207851584356n, 6630713008605848931n,
        15272332635899000284n, 8293330822552540371n, 3663678680344765735n, 6202077743967849795n
    ], [
        13832924244624368586n, 9528928158945462573n, 14179395919100586062n, 6969939104331843825n,
        7310089016056177663n, 2330122620296285666n, 366614009711950633n, 15868530560167501485n,
        13062220818183197584n, 13862631616076321733n, 7173753005560765122n, 7401758400845058914n,
        9637063954876722222n, 12866686223156530935n, 12581363180925564601n, 18095168288661498698n,
        705027512553866826n, 11889965370647053343n, 15427913285119170690n, 8002547776917692331n,
        9851209343392987354n, 17007018513892100862n, 13156544984969762532n, 17174851075492447770n,
        13752314705754602748n, 13854843066947953115n, 18247924359033306459n, 16205059579474396736n,
        1084973183965784029n, 16412335787336649629n, 14382883703753853349n, 12271654898018238098n
    ], [
        16169418098402584869n, 5525673020174675568n, 12936657854060094775n, 11948000946147909875n,
        15353833107488796089n, 14618049475397165649n, 3778101905464969682n, 6365740825469087467n,
        16234655844237036703n, 2799885056387663031n, 5302770125087202743n, 5660153358913361974n,
        16770940414519030354n, 7509765183491975519n, 4169330364728586675n, 5574639924268823631n,
        9363939970816876135n, 17273737051928351082n, 17191485912205891684n, 6684944805026392094n,
        5584485950418500906n, 2615283273796770954n, 7797794717456616920n, 17426764471212936270n,
        17235322656552057567n, 9981174656309333188n, 4589122101654576321n, 894484646987718932n,
        8582267286539513308n, 13903972190091769637n, 17428182081597550586n, 9464705238429071998n
    ]
];
// STARK DEFINITION
// ================================================================================================
const field = new index_1.PrimeField(2n ** 64n - 21n * 2n ** 30n + 1n);
const steps = 32;
const alpha = 3n;
const invAlpha = -6148914683720324437n;
// MDS matrix
const mds = [
    [18446744051160973310n, 18446744051160973301n],
    [4n, 13n]
];
const invMds = [
    [2049638227906774814n, 6148914683720324439n],
    [16397105823254198500n, 12297829367440648875n]
];
const tFunctionScript = `
    a0: r0^${alpha};
    a1: r1^${alpha};

    b0: (${mds[0][0]} * a0) + (${mds[0][1]} * a1) + k0;
    b1: (${mds[1][0]} * a0) + (${mds[1][1]} * a1) + k1;

    c0: b0^(${invAlpha});
    c1: b1^(${invAlpha});

    d0: (${mds[0][0]} * c0) + (${mds[0][1]} * c1) + k2;
    d1: (${mds[1][0]} * c0) + (${mds[1][1]} * c1) + k3;
`;
const tConstraintsScript = `
    a0: r0^${alpha};
    a1: r1^${alpha};

    b0: (${mds[0][0]} * a0) + (${mds[0][1]} * a1) + k0;
    b1: (${mds[1][0]} * a0) + (${mds[1][1]} * a1) + k1;

    c0: (n0 - k2);
    c1: (n1 - k3);
    
    d0: (${invMds[0][0]} * c0) + (${invMds[0][1]} * c1);
    d1: (${invMds[1][0]} * c0) + (${invMds[1][1]} * c1);
    
    e0: d0^${alpha};
    e1: d1^${alpha};
`;
// create the STARK for MiMC computation
const rescStark = new index_1.Stark({
    field: field,
    tExpressions: {
        [index_1.script]: tFunctionScript,
        n0: 'd0',
        n1: 'd1'
    },
    tConstraints: {
        [index_1.script]: tConstraintsScript,
        q0: `b0 - e0`,
        q1: `b1 - e1`
    },
    tConstraintDegree: 3,
    constants: [{
            values: roundConstants[0],
            pattern: 'repeat'
        }, {
            values: roundConstants[1],
            pattern: 'repeat'
        }, {
            values: roundConstants[2],
            pattern: 'repeat'
        }, {
            values: roundConstants[3],
            pattern: 'repeat'
        }]
});
// TESTING
// ================================================================================================
// set up inputs and assertions
const inputs = buildInputs(1n);
const assertions = [
    { step: steps - 1, register: 0, value: 17048383143367219839n }
];
// generate a proof
const proof = rescStark.prove(assertions, steps, inputs);
console.log('-'.repeat(20));
// verify the proof
rescStark.verify(assertions, proof, steps);
console.log('-'.repeat(20));
console.log(`Proof size: ${Math.round(rescStark.sizeOf(proof) / 1024 * 100) / 100} KB`);
// HELPER FUNCTIONS
// ================================================================================================
function buildInputs(value) {
    const r = [
        field.add(value, initialConstants[0]),
        field.add(0n, initialConstants[1])
    ];
    // first step of round 1
    let a0 = field.exp(r[0], invAlpha);
    let a1 = field.exp(r[1], invAlpha);
    r[0] = field.add(field.add(field.mul(mds[0][0], a0), field.mul(mds[0][1], a1)), initialConstants[2]);
    r[1] = field.add(field.add(field.mul(mds[1][0], a0), field.mul(mds[1][1], a1)), initialConstants[3]);
    return r;
}
//# sourceMappingURL=rescue.js.map