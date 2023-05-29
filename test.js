const thaiAddressCut = require('thai-address-cut')

lstDemo = [
    '13/1 Moo5.Kingkawa Road, Bang Kaeo, Bangplee, Smutprakan 10540',
    '13/1 Moo5.Kingkawa Road, Yi San, Amphawa,  Samut Songkhram 75540',
    '349 SJ Infinite 1 Business Complex, 28th Floor, Vibhavadi Rangsit Road, Chompol, Chatuchak, Bangkok 10101',
    ' 611 Bamrung Mueang Rd, Khlong Maha Nak, Pom Prap Sattru Phai, Bangkok 10100',
    '331 ,Si Racha District, Chon Buri 20110',
    'Tipco Tower 1, 118/1 Rama 6 Road, Phayathai, Phayathai District, Bangkok 10400',
    '1, Thung Yai, Hat Yai District, Songkhla 90110',
    '99/11, Thung Song Hong,Khet Lak Si, Bangkok 10330',
    '99/11, Thung Song Hong, LakSi, Bangkok 10330',
    '99/11, Thung Song Hong, Lak Si, Bangkok 10330',
    '99/11, Thung Song Hong, LakSe, Bangkok 10330',
    '123 suphalai ville laksi donmoung, soi changargardutid5, changargardutid road, donmaeung, donmeung, bangkok, 10210',
    '123 suphalai ville laksi donmoung, soi changargardutid5, changargardutid road, donmaeung, donmeung, 10210',
    'THAI MIYAKE FORGING CO., LTD.7/405 M.6,,T.MABYANGPORN,,A.PLUAKDAENG,RAYONG',
    '21140 SEI Thai Electric Conductor Co., Ltd. (STEC)7/414 Moo 6,Tambol Mabyangporn,Amphur Pluakdaeng,Rayong,',
    'Thai Diamond Industry Co.,Ltd.156 Moo 7 Suksawat Tel : 02-4272252,Khet Rat Burana Province,Khwang Bang Pakok,Bangkok,10140',
    'Thai Diamond Industry Co.,Ltd.156 Moo 7 Suksawat Tel : 02-427-2252,Khwang Bang Pakok,Khet Rat Burana Province,Bangkok,10140',
    '13/1 Moo5.Kingkawa Road, Bang Kaeo, Bangplee, Smutprakan 10540',
    '13 King Kaeo Rd, Racha Tewa, Bang Phli District, Samut Prakan 10540',
    '89/279 SupalaiVille LakSi-Donmueng, Soi. Changargardutid5, Changagardutid Road, DonMeuang, DonMeuang, Bangkok, 10210'
 
]


for (var i = 0; i < lstDemo.length; i++) {
    console.log(thaiAddressCut.cut(lstDemo[i]),true)
    console.log('\n')
}


