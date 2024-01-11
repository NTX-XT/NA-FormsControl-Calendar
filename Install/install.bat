@echo off
cls
echo Note: An IISRESET will be performed, press Ctrl-C if you are not ready for this to happen....
pause
echo Resetting IIS....
iisreset
echo Copying Files....
xcopy SourceCodeANZ.Forms.Controls.Calendar.dll "C:\Program Files\K2\K2 SmartForms Designer\bin\" /y /r
xcopy SourceCodeANZ.Forms.Controls.Calendar.dll "C:\Program Files\K2\K2 SmartForms Runtime\bin\" /y /r
"C:\Program Files\K2 blackpearl\Bin\controlutil.exe" register -assembly:"C:\Program Files\K2\K2 SmartForms Designer\bin\SourceCodeANZ.Forms.Controls.Calendar.dll"

pause