//import
let country = require('./country_3.json')
let city = require('./city_4.json')
let tambon = require('./tambon_1_1.json')

//Demo Data
lstDemo = ['13/1 Moo5.Kingkawa Road, Rajathewa, Bangplee, Smutprakan 10540',
    '13/1 Moo5.Kingkawa Road, Yi San, Amphawa,  Samut Songkhram 10540',
    '349 SJ Infinite 1 Business Complex, 28th Floor, Vibhavadi Rangsit Road, Chompol, Chatuchak, Bangkok 10101',
    '1401 Ekkachai Rd, บางบอนใต้, Bang Bon, Bangkok 10150',
    ' 611 Bamrung Mueang Rd, Khlong Maha Nak, Pom Prap Sattru Phai, Bangkok 10100',
    '143-144 หมู่ที่ 8 ซอยกังวาล 2 Petchkasem Rd, Sam Phran District, Nakhon Pathom 73160',
    '888/114 อาคารมหาทุนพลาซ่า ชั้น 11 ถนน เพลินจิต ,Lumphini, Pathum Wan, Bangkok 10330',
    'ซอยกาญจนาภิเษก 140/1 อาคารทาคูนิ ซอย นาวีเจริญทรัพย์ ,Bang Khae, Bangkok 10160',
    '331 ,Si Racha District, Chon Buri 20110',
    'Tipco Tower 1, 118/1 Rama 6 Road, Phayathai, Phayathai District, Bangkok 10400',
    '1, Thung Yai, Hat Yai District, Songkhla 90110',
    '444 อาคารเอ็มบีเค ทาวเวอร์ ชั้น 18 19 Phaya Thai Rd, Wang Mai, Pathum Wan, Bangkok 10330'
]

function separateAddress(address) {
    try {
        console.log(address)
        let remainingTxt = address;
        const postPattern = /[0-9]{5}/;
        const postMatched = address.match(postPattern);
        let postCode = '';
        if (postMatched) {
            [postCode] = postMatched
        }
        //console.log(postCode)
        remainingTxt = remainingTxt.replace(postCode, '').trim();
        remainingTxt = remainingTxt.replace("district",'')
        remainingTxt = remainingTxt.replace("District",'')

        let wordlist = remainingTxt.split(',').map(word => word.trim());
        //console.log(wordlist)

        // if(regex.test(address)){ //Eng

        var countryTxt = ''
        var cityTxt = ''
        var tambonTxt = ''

        var countryValue = getValueByKey(country, wordlist[wordlist.length - 1])
        var cityValue
        var tambonValue
        //let cityValuenew
        //console.log(countryValue)

        if (countryValue) {
            countryTxt = wordlist[wordlist.length - 1]
        }
        else {
            countryTxt = (findSimilarObj(country, wordlist[wordlist.length - 1]))
            countryValue = getValueByKey(country, countryTxt)
            if (countryValue === undefined)
                throw Error('Cannot found country');
        }

        console.log(countryValue)
        cityValue = getValueByKey(city[countryValue], wordlist[wordlist.length - 2])
        if (cityValue) {
            cityTxt = wordlist[wordlist.length - 2]

        }
        else {
            cityTxt = (findSimilarObj(city[countryValue], wordlist[wordlist.length - 2]))
            cityValue = getValueByKey(city[countryValue], cityTxt)
            if (cityValue === undefined)
                throw Error('Cannot found city');
        }

        console.log(cityValue)
        if(wordlist.length - 3 != 0){
            tambonValue = getValueByKey(tambon[cityValue], wordlist[wordlist[wordlist.length - 3]])
            if (tambonValue) {
                tambonTxt = wordlist[wordlist.length - 3]
            }
            else {
                tambonTxt = (findSimilarObj(tambon[cityValue], wordlist[wordlist.length - 3]))
                tambonValue = getValueByKey(tambon[cityValue], findSimilarObj(tambon[cityValue], tambonTxt))
                if (tambonValue === undefined)
                    throw Error('Cannot found tambon');
            }
        }

        console.log(tambonValue)


        return {
            Building: wordlist[0],
            Province: countryTxt,
            City: cityTxt,
            Tambon: tambonTxt,
            PostCodeCode: postCode
        }


    } catch (error) {
        console.error(error);
    }

}

function findSimilarObj(objs, value) {
    var maxSim = 0
    var newObj = ''
    for (let obj in objs) {
        //console.log(x)
        tempSim = similarity(obj, value)
        if (tempSim > maxSim) {
            maxSim = tempSim;
            newObj = obj;
        }
    }

    if (maxSim > 0.6)
        return newObj
    else
        return undefined
}

function getValueByKey(object, key) {
    return object[key]
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

//Levenshtein distance
function editDistance(str1, str2) {
    s1 = str1.toLowerCase().replace(/[^a-z]/g, '')
    s2 = str2.toLowerCase().replace(/[^a-z]/g, '')

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

//Demo
for (var i = 0; i < lstDemo.length; i++) {
    console.log(separateAddress(lstDemo[i]))
    console.log('\n')
}
