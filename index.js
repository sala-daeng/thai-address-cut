//import
let province = require('./data/province_3.json')
let city = require('./data/city_4.json')
let tambon = require('./data/tambon_1_1.json')

function swapItem(arr) {
  [arr[arr.length - 1], arr[arr.length - 2]] = [arr[arr.length - 2],arr[arr.length - 1]]
  return arr
}
function cleanData(txt) {
  let newTxt = txt
  newTxt = newTxt.replace(/(district|District|Tambol|Province|Khwang|Amphur|Khet|Tel|:|T\.|A\.)/g, '')
  newTxt = newTxt.replace(/,+/g, ',')
  newTxt = newTxt.replace(/,$/, '')
  return newTxt
}

function removeItem(arr, keyword) {
  if (keyword != '') {
    arr,(indexOf = (arr, q) => arr.findIndex((item) => q.toLowerCase() === item.toLowerCase()))
    arr.pop(indexOf(arr, keyword))
    return arr
  }
  return arr
}

function findSimilarObj(objs, value) {
  var maxSim = 0
  var newObj = ''
  let regex = RegExp(/^[a-zA-Z\s\*]/)
  for (let obj in objs) {
    //console.log(x)
    if (regex.test(obj)) {
      tempSim = similarity(obj, value)
      if (tempSim > maxSim) {
        maxSim = tempSim
        newObj = obj
      }
    }
  }
  //console.log(maxSim)
  if (maxSim > 0.6)
    return newObj
  else
    return undefined
}

function getValueByKey(object, key) {
  let regex = RegExp(/^[a-zA-Z\s\*]/)
  if (key != null && key != undefined && object != null) {
    //console.log(key)
    const asLowercase = key.toLowerCase().replace('khet', '').replace(regex, '')
    return object[
      Object.keys(object).find((k) =>k.toLowerCase().replace('khet', '').replace(regex, '').trim() === asLowercase)
    ]
  }
  return undefined
}

function getKeyByValue(object, value) {
  let regex = RegExp(/^[a-zA-Z\s\*]/)
  return Object.keys(object).find(
    (key) => regex.test(key) && object[key] === value
  )
}

function similarity(s1, s2) {
  var longer = s1
  var shorter = s2
  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }
  var longerLength = longer.length
  if (longerLength == 0) {
    return 1.0
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  )
}

//Levenshtein distance
function editDistance(str1, str2) {
  let s1 = str1.toLowerCase().replace(/[^a-z]/g, '')
  s1 = s1.replace('khet', '').trim()

  let s2 = str2.toLowerCase().replace(/[^a-z]/g, '')
  s2 = s2.replace('khet', '').trim()

  var costs = new Array()
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) 
        costs[j] = j
      else {
        if (j > 0) {
          var newValue = costs[j - 1]
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) 
      costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

module.exports = {
  cut: (address, fullSearch = true) => {
    let start = Date.now();
    console.log(address)

    let remainingTxt = address
    const postPattern = /\b\d{5}\b/
    const postMatched = address.match(postPattern)

    const phonePattern =/((0\d{2})(\d{7}|-\d{7}|-\d{3}-\d{4})|(0\d{1})(\d{7}|-\d{7}|-\d{3}-\d{4}))/
    const phoneMatched = address.match(phonePattern)

    // const houseNumPattern = /\b\d{1,4}\/\d{1,4}\b|(\b\d{1,4})\b/;
    // const houseNumMatch = address.match(houseNumPattern)

    let phone = ''
    let postCode = ''
    // let houseNum = ''

    if (postMatched) {
      [postCode] = postMatched
      remainingTxt = remainingTxt.replace(postCode, '').trim()
    }
    if (phoneMatched) {
      [phone] = phoneMatched
      remainingTxt = remainingTxt.replace(phone, '').trim()
    }
    // if (houseNumMatch) {
    //   [houseNum] = houseNumMatch
    //   remainingTxt = remainingTxt.replace(houseNum, '').trim()
    // }

    remainingTxt = cleanData(remainingTxt)

    //console.log(postCode)
    let wordlist = remainingTxt.split(',').map((word) => word.trim())
    wordlist = wordlist.filter(
      (element) =>
        element != null &&
        element !== undefined &&
        element !== '' &&
        element != '.'
    )
    //console.log(wordlist)

    var provinceTxt = ''
    var cityTxt = ''
    var tambonTxt = ''

    var provinceValue
    var cityValue
    var tambonValue

    provinceValue = getValueByKey(province, wordlist[wordlist.length - 1])

    //province search
    let provinceTempTxt = ''
    if (provinceValue) {
      provinceTxt = getKeyByValue(province, provinceValue)
      provinceTempTxt = wordlist[wordlist.length - 1]
    }
    //find similar
    else if (provinceValue === undefined && fullSearch) {
      provinceTxt = findSimilarObj(province, wordlist[wordlist.length - 1])
      provinceValue = getValueByKey(province, provinceTxt)
      provinceTempTxt = wordlist[wordlist.length - 1]
    }
    //find from postcode
    if (provinceValue === undefined && postCode != '') {
      provinceValue = postCode.slice(0, 2)
      provinceTxt = getKeyByValue(province, provinceValue)
      provinceTempTxt = ''
    }

    wordlist = removeItem(wordlist, provinceTempTxt)
    //console.log(wordlist)
    console.log(provinceValue)

    let cityTempTxt = ''
    let tambonTempTxt = ''
    let count = 1
    for (var i = 0; i < 2 && count <= 2; i++) {
      cityValue = getValueByKey(
        city[provinceValue],
        wordlist[wordlist.length - 1]
      )
      if (cityValue) {
        cityTxt = wordlist[wordlist.length - 1]
        cityTempTxt = cityTxt
      } else if (cityValue === undefined && fullSearch) {
        cityTxt = findSimilarObj(
          city[provinceValue],
          wordlist[wordlist.length - 1]
        )
        cityTempTxt = wordlist[wordlist.length - 1]
        cityValue = getValueByKey(city[provinceValue], cityTxt)
      }

      if (wordlist.length - 2 >= 0) {
        tambonValue = getValueByKey(
          tambon[cityValue],
          wordlist[wordlist.length - 2]
        )
        if (tambonValue) {
          tambonTxt = wordlist[wordlist.length - 2]
          tambonTempTxt = tambonTxt
          break
        } 
        else if (fullSearch) {
          tambonTxt = findSimilarObj(
            tambon[cityValue],
            wordlist[wordlist.length - 2]
          )
          tambonValue = getValueByKey(tambon[cityValue], tambonTxt)
          if (tambonValue === undefined) tambonTxt = ''
          else {
            tambonTempTxt = wordlist[wordlist.length - 2]
            break
          }
        }
      }

      if (tambonTxt === '' && wordlist.length > 3) {
        i = 0
        count++
        swapItem(wordlist)
      }
    }

    console.log(cityValue)
    console.log(tambonValue)

    wordlist = removeItem(wordlist, cityTempTxt)
    wordlist = removeItem(wordlist, tambonTempTxt)

    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken + " milliseconds");
    return {
      addressDetail: wordlist.join(' '),
      province: provinceTxt,
      city: cityTxt,
      tambon: tambonTxt,
      postCodeCode: postCode,
      phoneNumber: phone,
    }
  },
}
