// Wrapper for WEL that uses the unified group-selector implementation.
window.initGroupSelector({
  plansTemplate: 'https://plany.wel.wat.edu.pl/zima/{group}.htm',
  calendarsPaths: 'db/calendars/wel_calendars,db/calendars/wel,db/wel_calendars',
  schedulesPaths: 'db/schedules/wel_schedules,db/calendars/wel_schedules'
});