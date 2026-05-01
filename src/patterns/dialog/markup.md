# dialog

Root selectors:
- [data-ui8kit="dialog"]
- [data-ui8kit="sheet"]
- [data-ui8kit="alertdialog"]

Open controls:
- data-ui8kit-dialog-open (explicit trigger)
- data-ui8kit-dialog-target (target id fallback)

Close controls:
- data-ui8kit-dialog-close
- click on data-ui8kit-dialog-overlay

Runtime attributes:
- data-state="open"|"closed"
- aria-expanded="true"|"false" on linked open controls
- data-was-hidden (internal)
