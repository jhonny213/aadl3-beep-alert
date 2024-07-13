const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const sound = require("sound-play");
const path = require("path");
const volume = 0.5;
const filePath = path.join(__dirname, "alert-33762.mp3");
const app = express();
const port = 3000;
const url = 'https://aadl3inscription2024.dz'; // استبدل بـ URL الخاص بالموقع الذي تريد جلبه
const baseUrl = 'https://aadl3inscription2024.dz'; // اسم النطاق الخاص بالموقع

let pageContent = ''; // متغير لتخزين محتوى الصفحة

async function fetchPage() {
    try {
        const response = await axios.get(url);
        let html = response.data;
        const $ = cheerio.load(html);

        // تحديث الروابط في الصفحة
        $('link, script, img').each((i, elem) => {
            const src = $(elem).attr('src');
            const href = $(elem).attr('href');

            // تحديث روابط src
            if (src && src.startsWith('/')) {
                $(elem).attr('src', `${baseUrl}${src}`);
            } else if (src && !src.startsWith('http')) {
                $(elem).attr('src', `${baseUrl}/${src}`);
            }

            // تحديث روابط href
            if (href && href.startsWith('/')) {
                $(elem).attr('href', `${baseUrl}${href}`);
            } else if (href && !href.startsWith('http')) {
                $(elem).attr('href', `${baseUrl}/${href}`);
            }
        });

        // إضافة JavaScript إلى الصفحة
        $('body').append(`
            <script>
                console.log("Page loaded successfully");
            </script>
        `);

        // تحديث محتوى الصفحة بعد تعديل الروابط
        pageContent = $.html();

        console.log('Page fetched successfully');
        
        // إذا كان هناك علامة تدل على ازدحام يمكنك إضافتها هنا
        if ($('body').text().includes('ازدحام')) {
            $('body').append(`
                <script>
                    console.log("ازدحام في الموقع، سيتم التحديث بعد 1/1000 ثوانٍ");
                </script>
            `);
            console.log('ازدحام في الموقع، سيتم التحديث بعد 1/1000 ثوانٍ');
            setTimeout(fetchPage, 1);
        } else {
              sound.play(filePath,volume);
            $('body').append(`
                <script>
                    console.log("تم جلب الصفحة بنجاح");
                </script>
            `);
            console.log('تم جلب الصفحة بنجاح');
            alert('تم جلب الصفحة بنجاح');
        }

    } catch (error) {
        console.error('Error fetching the page:', error);
        setTimeout(fetchPage, 1); // في حالة الخطأ، إعادة المحاولة بعد 1/1000 ثوانٍ
    }
}

// بدء جلب الصفحة
fetchPage();

// إعداد خادم الويب
app.get('/', (req, res) => {
    res.send(pageContent);
});

app.listen(port, '0.0.0.0', () => {

    console.log(`Server running at https://aadl3inscription2024.dz`);
});
