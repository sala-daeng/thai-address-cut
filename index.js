//import
let province = require('./data/province_3.json')
let district = require('./data/city_4.json')
let subdistrict = require('./data/tambon_1_1.json')

function swapItem(arr) {
  [arr[arr.length - 1], arr[arr.length - 2]] = [arr[arr.length - 2],arr[arr.length - 1]]
  return arr
}
function cleanData(txt,lang) {
    let newTxt = txt
    if(lang === 'EN'){
        newTxt = newTxt.replace(/(district|District|Tambol|Province|Khwang|Amphur|Khet|Tel|:|T\.|A\.)/g, '') 
    }
    else{
        newTxt = newTxt.replace(/(เขต|แขวง|จังหวัด|อำเภอ|ตำบล|อ\.|ต\.|จ\.|โทร\.?|เบอร์|ที่อยู่)/g, '')
    }
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

function findSimilarObj(objs, value, lang) {
  let maxSim = 0
  let newObj = ''
  const regexLang = RegExp(/^[a-zA-Z0-9\,\.\(\)\:\s]*$/)
  if(lang === 'EN'){
      for (let obj in objs) {
        //console.log(x)
        if (regexLang.test(obj)) {
          tempSim = similarity(obj, value, lang)
          if (tempSim > maxSim) {
            maxSim = tempSim
            newObj = obj
          }
        }
      }
  }
  else{
    for (let obj in objs) {
        tempSim = similarity(obj, value, lang)
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

function getValueByKey(object, key, lang) {
    if (key != null && key != undefined && object != null) {
        //console.log(key)
        if(lang === 'EN'){
            const regex = RegExp(/^[a-zA-Z\s\*]/)
            const asLowercase = key.toLowerCase().replace(/^(khet)/i, '').replace(regex, '')
            return object[
            Object.keys(object).find((k) =>k.toLowerCase().replace(/^(khet)/i, '').replace(regex, '').trim() === asLowercase)
            ]
        }
        else{
            return object[
            Object.keys(object).find((k) =>k.replace(/^(เขต)/, '').trim() === key.replace(/^(เขต)/, ''))
            ]
        }
    }
    return undefined
}

function getKeyByValue(object, value, lang) {
    if(lang === 'EN'){
        const regexLang = RegExp(/^[a-zA-Z0-9\,\.\(\)\:\s]*$/)
        return Object.keys(object).find(
            (key) => regexLang.test(key) && object[key] === value
        )
    }
    else{
        return Object.keys(object).find(
            (key) => object[key] === value
        )
    }
}

function similarity(s1, s2, lang) {
  let longer = s1
  let shorter = s2
  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }
  let longerLength = longer.length
  if (longerLength == 0) {
    return 1.0
  }
  return (
    (longerLength - editDistance(longer, shorter, lang)) / parseFloat(longerLength)
  )
}

//Levenshtein distance
function editDistance(str1, str2, lang) {
    let s1 = ''
    let s2 = ''
    if(lang === 'EN'){
        s1 = str1.toLowerCase().replace(/[^a-z]/g, '')
        s1 = s1.replace(/^(khet)/i, '').trim()
    
        s2 = str2.toLowerCase().replace(/[^a-z]/g, '')
        s2 = s2.replace(/^(khet)/i, '').trim()
    }
    else{
        s1 = s1.replace(/^(เขต)/, '').trim()
        s2 = s2.replace(/^(เขต)/, '').trim()
    }

  let costs = new Array()
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) 
        costs[j] = j
      else {
        if (j > 0) {
          let newValue = costs[j - 1]
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
function removePrefix(data){
    return data.replace(/^(khet)|^(เขต)/i, '').replace(/\*$/,'').trim()
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

    const houseNumPattern = /\b\d{1,4}\/\d{1,4}\b|(\b\d{2,4})\b/;
    const houseNumMatch = address.match(houseNumPattern)

    let phone = ''
    let postCode = ''
    let houseNum = ''
    let nameTxt = ''

    if (postMatched) {
      [postCode] = postMatched
      remainingTxt = remainingTxt.replace(postCode, '').trim()
    }
    if (phoneMatched) {
      [phone] = phoneMatched
      remainingTxt = remainingTxt.replace(phone, '').trim()
    }
    if (houseNumMatch) {
      [houseNum] = houseNumMatch
      remainingTxt = remainingTxt.replace(houseNum, '|').trim()
      nameTxt = remainingTxt.split('|')[0].trim()
      remainingTxt = remainingTxt.replace(nameTxt, '').replace('|', '').trim()
    }

    const regexLang = RegExp(/^[!@#$%\s\^&\*\(\)_+=\[\]\\\{\}|;\':\"\,-\.\/a-zA-Z0-9]+$/);

    let provinceTxt = ''
    let districtTxt = ''
    let subdistrictTxt = ''


    let provinceValue
    let districtValue
    let subdistrictValue

    let wordlist = []

    if(regexLang.test(remainingTxt)){//------------------EN-------------------------
        remainingTxt = cleanData(remainingTxt,'EN')
        //console.log('ENG')
        wordlist = remainingTxt.split(',').map((word) => word.trim())
        wordlist = wordlist.filter(
          (element) =>
            element != null &&
            element !== undefined &&
            element !== '' &&
            element != '.'
        )
        //console.log(wordlist)
    
    
        provinceValue = getValueByKey(province, wordlist[wordlist.length - 1], 'EN')
    
        //province search
        let provinceTempTxt = ''
        if (provinceValue) {
          provinceTxt = getKeyByValue(province, provinceValue, 'EN')
          provinceTempTxt = wordlist[wordlist.length - 1]
        }
        //find similar
        else if (provinceValue === undefined && fullSearch) {
          provinceTxt = findSimilarObj(province, wordlist[wordlist.length - 1], 'EN')
          provinceValue = getValueByKey(province, provinceTxt, 'EN')
          provinceTempTxt = wordlist[wordlist.length - 1]
        }
        //find from postcode
        if (provinceValue === undefined && postCode != '') {
          provinceValue = postCode.slice(0, 2)
          provinceTxt = getKeyByValue(province, provinceValue, 'EN')
          provinceTempTxt = ''
        }
    
        wordlist = removeItem(wordlist, provinceTempTxt)
        //console.log(wordlist)
        console.log(provinceValue)
    
        let districtTempTxt = ''
        let subdistrictTempTxt = ''
        let count = 1
        for (let i = 0; i < 2 && count <= 2; i++) {
          districtValue = getValueByKey(district[provinceValue], wordlist[wordlist.length - 1], 'EN')
          if (districtValue) {
            districtTxt = wordlist[wordlist.length - 1]
            districtTempTxt = districtTxt
          } else if (districtValue === undefined && fullSearch) {
            districtTxt = findSimilarObj(district[provinceValue], wordlist[wordlist.length - 1], 'EN')
            districtTempTxt = wordlist[wordlist.length - 1]
            districtValue = getValueByKey(district[provinceValue], districtTxt, 'EN')
          }
    
          if (wordlist.length - 2 >= 0) {
            subdistrictValue = getValueByKey(subdistrict[districtValue], wordlist[wordlist.length - 2], 'EN')
            if (subdistrictValue) {
              subdistrictTxt = wordlist[wordlist.length - 2]
              subdistrictTempTxt = subdistrictTxt
              break
            } else if (fullSearch) {
              subdistrictTxt = findSimilarObj(subdistrict[districtValue], wordlist[wordlist.length - 2], 'EN')
              subdistrictValue = getValueByKey(subdistrict[districtValue], subdistrictTxt, 'EN')
              if (subdistrictValue === undefined) subdistrictTxt = ''
              else {
                subdistrictTempTxt = wordlist[wordlist.length - 2]
                break
              }
            }
          }
    
          if (subdistrictTxt === '' && wordlist.length > 3) {
            i = 0
            count++
            swapItem(wordlist)
          }
        }
    
        console.log(districtValue)
        console.log(subdistrictValue)
    
        wordlist = removeItem(wordlist, districtTempTxt)
        wordlist = removeItem(wordlist, subdistrictTempTxt)
    
        //Addition Option
        roadTxt = ''
        soiTxt = ''
        mooTxt = ''
        
        wordlist.forEach((word) => {
          if(word.match(/(Moo\s*\d+)|(M.\d+)/i)){
            [mooTxt] = word.match(/Moo\s*\d+|(M.\d+)/i)
            let indextTemp = wordlist.indexOf(word)
            wordlist[indextTemp] = wordlist[indextTemp].replace(mooTxt, '').trim()
            word= wordlist[indextTemp].replace(mooTxt, '').trim()
            mooTxt = mooTxt.replace(/Moo\s*|(M.)/i, '').trim()
          }
          if (/(rd)$/i.test(word.toLowerCase())){
            roadTxt = word
            roadTxt = roadTxt.replace(/(rd)$/i,'').trim()
          }
          else if(/(road)$/i.test(word.toLowerCase()) ){
            roadTxt = word
            roadTxt = roadTxt.replace(/(road)$/i,'').trim()
          }
          if(/^(soi\.*)/i.test(word.toLowerCase())){
            soiTxt = word
            soiTxt = soiTxt.replace(/^(soi\.*)/i,'').trim()
          }
          else if( /^(s\.)/i.test(word.toLowerCase()) ){
            soiTxt = word
            soiTxt = soiTxt.replace(/^(s\.)/i,'').trim()
          }
        })
    
        wordlist = removeItem(wordlist, roadTxt)
        wordlist = removeItem(wordlist, soiTxt)
    }
    else{//------------------TH-------------------------
        remainingTxt = cleanData(remainingTxt,'TH')
        


        //console.log('TH')
        //console.log(postCode)
        wordlist = remainingTxt.split(' ').map((word) => word.trim())
        wordlist = wordlist.filter(
          (element) =>
            element != null &&
            element !== undefined &&
            element !== '' &&
            element != '.'
        )
        //console.log(wordlist)
    
    
        provinceValue = getValueByKey(province, wordlist[wordlist.length - 1], 'TH')
    
        //province search
        let provinceTempTxt = ''
        if (provinceValue) {
          provinceTxt = getKeyByValue(province, provinceValue, 'TH')
          provinceTempTxt = wordlist[wordlist.length - 1]
        }
        //find similar
        else if (provinceValue === undefined && fullSearch) {
          provinceTxt = findSimilarObj(province, wordlist[wordlist.length - 1], 'TH')
          provinceValue = getValueByKey(province, provinceTxt, 'TH')
          provinceTempTxt = wordlist[wordlist.length - 1]
        }
        //find from postcode
        if (provinceValue === undefined && postCode != '') {
          provinceValue = postCode.slice(0, 2)
          provinceTxt = getKeyByValue(province, provinceValue, 'TH')
          provinceTempTxt = ''
        }
    
        wordlist = removeItem(wordlist, provinceTempTxt)
        //console.log(wordlist)
        console.log(provinceValue)
    
        let districtTempTxt = ''
        let subdistrictTempTxt = ''
        let count = 1
        for (let i = 0; i < 2 && count <= 2; i++) {
          districtValue = getValueByKey(district[provinceValue], wordlist[wordlist.length - 1], 'TH')
          if (districtValue) {
            districtTxt = wordlist[wordlist.length - 1]
            districtTempTxt = districtTxt
          } else if (districtValue === undefined && fullSearch) {
            districtTxt = findSimilarObj(district[provinceValue], wordlist[wordlist.length - 1], 'TH')
            districtTempTxt = wordlist[wordlist.length - 1]
            districtValue = getValueByKey(district[provinceValue], districtTxt, 'TH')
          }
    
          if (wordlist.length - 2 >= 0) {
            subdistrictValue = getValueByKey(subdistrict[districtValue], wordlist[wordlist.length - 2], 'TH')
            if (subdistrictValue) {
              subdistrictTxt = wordlist[wordlist.length - 2]
              subdistrictTempTxt = subdistrictTxt
              break
            } else if (fullSearch) {
              subdistrictTxt = findSimilarObj(subdistrict[districtValue], wordlist[wordlist.length - 2], 'TH')
              subdistrictValue = getValueByKey(subdistrict[districtValue], subdistrictTxt, 'TH')
              if (subdistrictValue === undefined) subdistrictTxt = ''
              else {
                subdistrictTempTxt = wordlist[wordlist.length - 2]
                break
              }
            }
          }
    
          if (subdistrictTxt === '' && wordlist.length > 3) {
            i = 0
            count++
            swapItem(wordlist)
          }
        }
    
        console.log(districtValue)
        console.log(subdistrictValue)
    
        wordlist = removeItem(wordlist, districtTempTxt)
        wordlist = removeItem(wordlist, subdistrictTempTxt)
    
        //Addition Option
        roadTxt = ''
        soiTxt = ''
        mooTxt = ''

        
        wordlist.forEach((word) => {
            
          if(word.match(/(หมู่\s*\d+)|(ม.\d+)/i)){
            [mooTxt] = word.match(/หมู่\s*\d+|(ม\.\d+)/i)
            let indextTemp = wordlist.indexOf(word)
            wordlist[indextTemp] = wordlist[indextTemp].replace(mooTxt, '').trim()
            word= wordlist[indextTemp].replace(mooTxt, '').trim()
            mooTxt = mooTxt.replace(/หมู่\s*|(ม.)/i, '').trim()
          }

          if (/^(ถนน)/.test(word.toLowerCase())){
            roadTxt = word
            roadTxt = roadTxt.replace(/^(ถนน)/,'').trim()
          }
          else if(/^(ถ\.)/.test(word.toLowerCase()) ){
            roadTxt = word
            roadTxt = roadTxt.replace(/^(ถ\.)/,'').trim()
          }

          if(/^(ซอย)/.test(word)){
            soiTxt = word
            soiTxt = soiTxt.replace(/^(ซอย)/,'').trim()
          }
          else if( /^(ซ\.)/.test(word.toLowerCase()) ){
            soiTxt = word
            soiTxt = soiTxt.replace(/^(ซ\.)/,'').trim()
          }
        })
    
        wordlist = removeItem(wordlist, roadTxt)
        wordlist = removeItem(wordlist, soiTxt)
    }

    
    let timeTaken = Date.now() - start;
    console.log("Total time taken : " + timeTaken + " milliseconds");
    return {
        name: nameTxt,
        houseNumber: houseNum,
        moo: mooTxt,
        soi: soiTxt,
        road: roadTxt,
        addressDetail: wordlist.join(' '),
        province: provinceTxt,
        district: removePrefix(districtTxt),
        subdistrict: removePrefix(subdistrictTxt),
        postCodeCode: postCode,
        phoneNumber: phone,
    }
  },
}
