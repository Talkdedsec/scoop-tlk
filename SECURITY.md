# Security policy · Güvenlik politikası

## English

Do not open a public issue for a vulnerability. Report it privately:

- **Security → Report a vulnerability** on this repository, or
- email **talkdedsec@proton.me** with `scoop-tlk` in the subject.

Acknowledgement within 72 hours, assessment within 7 days.

### In scope

- A manifest whose download URL, hash or `autoupdate` rule can deliver a file other than the official
  release.
- The excavator workflow being tricked into writing a malicious URL or hash into a manifest.
- Install or uninstall scripts in a manifest that do more than the app needs.

### Out of scope

- Vulnerabilities in the apps themselves — report those in the app's own repository.
- Scoop itself — report those to [ScoopInstaller/Scoop](https://github.com/ScoopInstaller/Scoop).

## Türkçe

Güvenlik açığı için herkese açık issue açma. Gizli bildir:

- bu repoda **Security → Report a vulnerability**, ya da
- konu satırında `scoop-tlk` geçen bir e-postayla **talkdedsec@proton.me**.

72 saat içinde dönüş, 7 gün içinde değerlendirme.

### Kapsamda

- İndirme adresi, hash ya da `autoupdate` kuralı resmi sürüm dışında bir dosya indirtebilen manifest.
- Excavator workflow'unun kandırılıp manifeste zararlı adres ya da hash yazması.
- Manifestteki kurulum/kaldırma scriptlerinin uygulamanın ihtiyacından fazlasını yapması.

### Kapsam dışı

- Uygulamaların kendi açıkları — onları uygulamanın kendi reposunda bildir.
- Scoop'un kendisi — [ScoopInstaller/Scoop](https://github.com/ScoopInstaller/Scoop)'a bildir.
