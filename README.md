# dotextensions-build

Github actions generates executables for 

---
os| arch
--|---
windows|x86_64
linux|x86_64
darwin|x86_64
---


Windows takes care of emulation https://docs.microsoft.com/en-us/windows/uwp/porting/apps-on-arm#win32-apps. for linux and darwin it has to be supported

For  other cpu architectures, there is no support in  github actions.



