/**
 * Country/year/topic eligibility for optional topical financial explainers.
 *
 * Deliberately empty until a human-reviewed local-public-debate source and an
 * independently verified statistical source are recorded. Large expenditure
 * shares by themselves NEVER qualify a topic for promotion.
 *
 * A future entry needs:
 * {country:'FR', year:2024, topic:'old-age-and-survivors',
 *  reviewedAt:'YYYY-MM-DD', debateSource:'https://…',
 *  dataSource:'https://…', explanation:'Brief neutral explanation…'}
 *
 * debateSource must establish that the specific question is actually discussed
 * in the selected country and period; dataSource must support the metric.
 */
export const REVIEWED_LOCAL_TOPICS=Object.freeze([]);

export function reviewedTopic(country,year,topic,registry=REVIEWED_LOCAL_TOPICS){
  if(typeof country!=='string'||!Number.isInteger(Number(year))||!topic)return null;
  const match=registry.find(record=>record?.country===country &&
    record.year===Number(year) && record.topic===topic &&
    typeof record.explanation==='string' && record.explanation.trim().length>0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(record.reviewedAt||'') &&
    [record.debateSource,record.dataSource].every(url=>{
      try{return new URL(url).protocol==='https:'}catch{return false}
    }));
  return match||null;
}
