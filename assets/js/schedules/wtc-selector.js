// Wrapper for WTC that uses the unified group-selector implementation.
window.initGroupSelector({
  plansTemplate: 'https://www.wtc.wat.edu.pl/Plany/{group}.htm',
  calendarsPaths: 'db/calendars/wtc_calendars,db/calendars/wtc,db/wtc_calendars',
  schedulesPaths: 'db/schedules/wtc_schedules,db/calendars/wtc_schedules'
});