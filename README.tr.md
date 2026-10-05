# scoop-tlk

[English](README.md) · **Türkçe**

Talkdedsec araçları için bir [Scoop](https://scoop.sh) bucket'ı. Windows, kurulum programı yok,
yönetici yetkisi gerekmez ve `scoop update` hepsini güncel tutar.

```powershell
scoop bucket add tlk https://github.com/Talkdedsec/scoop-tlk
```

## İçinde neler var

| Uygulama | Ne yapar | Lisans |
| --- | --- | --- |
| [`wymcmd`](https://github.com/Talkdedsec/tlk-wymcmd) | Bir konsol penceresinin neden açıldığını açıklar — onu hangi zamanlanmış görevin, servisin, kayıt defteri anahtarının ya da tıklamanın başlattığını, Windows'un zaten kaydettiklerinden yeniden kurar. | Kaynak kodu erişilebilir, kullanımı ücretsiz |
| [`tlk-visual`](https://github.com/Talkdedsec/tlk-visual) | Gerçek zamanlı ekran renk motoru — parlaklık, kontrast, gama, renk sıcaklığı ve gece görüşü doğrudan ekranın gama tablosuna yazılır. Sürücü yok, enjeksiyon yok. | GPL-3.0-or-later |
| [`tlk-tune`](https://github.com/Talkdedsec/tlk-tune) | Terminal müzik çalar — konsolda albüm kapağı, senkronize şarkı sözleri ve on bantlı ekolayzer; fare ya da klavyeyle kullanılır. Tek exe, ffmpeg gerekmez. | MIT |
| [`wsmf`](https://github.com/Talkdedsec/tlk-wsmf) | Klavye odağını çalan uygulamayı adıyla söyler ve bunu bir daha yapmasını engeller. Tepsi programı, klavye kancası yok. | MIT |

```powershell
scoop install tlk/wymcmd
scoop install tlk/tlk-visual
scoop install tlk/tlk-tune
scoop install tlk/wsmf
```

`wymcmd` x64 ve arm64 derlemeleriyle gelir, Scoop doğru olanı seçer. Diğerleri yalnızca x64.
`tlk-tune` iki adla kurulur: `tlk-tune` ve `tune`.

## Kurduğun şeyi doğrulamak

Her aracın bir sonraki sürümünden itibaren derlemeler bir GitHub attestation'ı taşıyor; böylece
Scoop'un indirdiği exe, onu üreten iş akışı çalışmasına kadar izlenebiliyor:

```powershell
gh attestation verify (scoop prefix wymcmd | Join-Path -ChildPath wymcmd.exe) --owner Talkdedsec
```

Bu, Scoop'un zaten doğruladığı checksum'dan daha güçlü: checksum dosyanın yolda değişmediğini
kanıtlar, attestation ise onu hangi commit'in ve hangi iş akışının derlediğini.

## Güncel tutma

`excavator` her gün çalışır; upstream'de yeni bir sürüm fark ederse manifesti günceller ve
commit'ler. Bir sürümün yapısı değişmedikçe burada hiçbir şey elle güncellenmez.

## Sorun bildirmek

Bir araçtaki hata o aracın kendi deposuna aittir — bağlantılar yukarıdaki tabloda. Buraya
yalnızca paketlemenin kendisi hatalıysa issue aç: yanlış mimariyi kuran bir manifest, `PATH`'te
görünmeyen bir shim, artık eşleşmeyen bir hash.

## Lisans

Buradaki manifestler MIT lisanslı. Yalnızca başka yerde yayımlanan yazılımın nasıl kurulacağını
tarif ederler; her uygulamanın kendi lisansı var, bağlantısı manifestinde ve yukarıdaki tabloda.
