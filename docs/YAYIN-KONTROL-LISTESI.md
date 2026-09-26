# HomeSpaGuide — Yayın ve Gelir Kontrol Listesi

Bu liste, sitenin kodda yapılamayan (hesap / kimlik / ödeme gerektiren) adımlarını
sırasıyla anlatır. Tümü **ücretsizdir** (alan adı hariç, ~10–12 $/yıl).

> Netlify'da bir "environment variable" (ortam değişkeni) eklemek için:
> Netlify → **homespaguide** projesi → **Project configuration → Environment variables → Add a variable**.
> Ekledikten sonra **Deploys → Trigger deploy → Deploy site** ile yeniden yayınlayın.

---

## 1. Amazon Associates (EN ÖNEMLİ — gelir buna bağlı)

1. https://affiliate-program.amazon.com adresinden hesabınız yoksa açın (ABD mağazası).
   Site adresi olarak yayındaki adresi girin.
2. **Associates Central → Account Settings → Manage Your Tracking IDs** bölümünden
   kendi takip kodunuzu (ör. `sizinkodunuz-20`) kopyalayın.
3. Netlify'da `AMAZON_ASSOCIATE_TAG` = `sizinkodunuz-20` ekleyin ve yeniden yayınlayın.
   - Bu yapılmazsa linkler `homespaguide-20` kodunu kullanır; bu kod size ait değilse **komisyon alamazsınız.**
4. Amazon, hesabı onaylamak için **ilk 180 gün içinde 3 satış** ister. Onaydan sonra
   PA-API (canlı fiyat/görsel) başvurusu yapılabilir.

## 2. Alan adı (homespaguide.com)

1. Alan adı sizde değilse Namecheap / Cloudflare Registrar / Porkbun'dan alın.
2. Netlify → **Domain management → Add a domain** → `homespaguide.com`.
3. Netlify'ın verdiği DNS kayıtlarını alan adı sağlayıcısına girin (veya Netlify DNS'e geçin).
4. HTTPS sertifikası otomatik gelir. **Site kodu kendiliğinden yeni alan adını
   kullanır** (canonical, sitemap, robots) — ek ayar gerekmez.

## 3. Google Search Console (ücretsiz, SEO için şart)

1. https://search.google.com/search-console → **Add property → URL prefix** → site adresi.
2. **HTML tag** yöntemini seçin; `content="..."` içindeki değeri kopyalayın.
3. Netlify'da `PUBLIC_GOOGLE_SITE_VERIFICATION` = o değer → yeniden yayınla → **Verify**.
4. **Sitemaps** bölümüne `sitemap-index.xml` girin.
5. Önemli sayfalar için **URL Inspection → Request indexing** yapın (ana sayfa, rehberler).

## 4. Bing Webmaster Tools (ChatGPT/Copilot aramaları Bing'i kullanır → GEO için önemli)

1. https://www.bing.com/webmasters → **Import from Google Search Console** (en kolayı).
   Veya meta etiketi: `PUBLIC_BING_SITE_VERIFICATION`.
2. Sitemap'i gönderin.

## 5. Ziyaretçi istatistikleri (birini seçin)

- **Cloudflare Web Analytics** (önerilen, ücretsiz, çerezsiz, izin banner'ı gerektirmez):
  dash.cloudflare.com → Analytics & Logs → Web Analytics → Add site → token'ı
  `PUBLIC_CLOUDFLARE_BEACON_TOKEN` olarak ekleyin.
- **Google Analytics 4**: `PUBLIC_GA4_ID` = `G-XXXXXXX`.

Site, Amazon butonlarına tıklamaları otomatik olarak `amazon_click` olayı olarak raporlar.

## 6. Google AdSense (reklam geliri)

Başvuru için sitede **yeterli özgün içerik** (şu an 16 makale + 28 ürün sayfası var)
ve birkaç haftalık organik trafik olması önerilir.

1. https://adsense.google.com → site ekle.
2. Yayıncı kimliğinizi (`ca-pub-XXXXXXXX`) Netlify'a `PUBLIC_ADSENSE_CLIENT` olarak ekleyin
   → yeniden yayınla. `ads.txt` ve AdSense kodu **otomatik** oluşur.
3. Onaydan sonra AdSense'te iki reklam birimi oluşturun ("In-article" ve "Display"),
   slot numaralarını `PUBLIC_ADSENSE_SLOT_INARTICLE` ve `PUBLIC_ADSENSE_SLOT_SIDEBAR` olarak ekleyin.
4. AdSense → **Privacy & messaging** → AB/İngiltere için Google'ın ücretsiz onay (CMP) mesajını açın.
5. İleride aylık ~50.000 oturuma ulaşınca Mediavine / Raptive gibi premium reklam ağlarına
   başvurmak AdSense'e göre 3–5 kat daha fazla gelir sağlar.

## 7. Bülten (e-posta listesi)

Footer'daki abonelik formu Netlify Forms'a bağlıdır (ücretsiz: 100 kayıt/ay).
- Netlify → **Forms** → formların etkin olduğunu kontrol edin; kayıtlar `newsletter` formunda görünür.
- Liste büyüyünce kayıtları CSV olarak alıp MailerLite / Buttondown (ücretsiz katmanlar) ile gönderin.
- **Kural:** e-postalarda doğrudan Amazon linki kullanmayın (Amazon yasaklar); siteye link verin.

## 8. Pinterest (bu niş için güçlü ücretsiz trafik kaynağı)

1. Ücretsiz Pinterest Business hesabı açın, siteyi doğrulayın (`PUBLIC_PINTEREST_VERIFICATION`).
2. Her makale için dikey (1000×1500) pin görseli oluşturup makaleye bağlayın.

---

## Sürekli yapılacaklar (büyüme)

- **Haftada 2–3 yeni makale**: "how to…", "best … for …", "… vs …" kalıbındaki sorular.
  Yeni içerik `npm run new-blog` / `npm run new-product` ile ya da `/admin` panelinden eklenir.
- **Her 3 ayda bir** ürünlerin Amazon'da hâlâ satıldığını ve fiyat aralıklarının doğru olduğunu kontrol edin
  (`npm run audit-links`).
- Search Console'da "gösterim çok, tıklama az" olan sayfaların başlık/açıklamalarını iyileştirin.
- İçerik kuralı: "we tested / we measured" gibi test iddiaları **yasak** (bkz. `EDITORIAL_VOICE.md`).
