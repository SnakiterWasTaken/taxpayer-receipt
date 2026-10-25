/**
 * Official Eurostat COFOG group-level pension-related functions (GF1002/GF1003).
 * These are nested WITHIN GF10, never additional expenditure to add to TOTAL.
 * Old-age includes more than cash pensions; survivors may include other benefits.
 * Not a transfer to/from ministry budgets, and not the French CAS adjustment.
 */
export function pensionTransparency(entry, contribution=null) {
  const p=entry?.pensionDetail;
  if(!p)return null;
  if(contribution!==null && (!Number.isFinite(contribution)||contribution<0))
    throw new RangeError('Illustrative tax contribution must be a nonnegative finite number.');
  return {
    ...p,
    oldAgeAllocated:contribution===null?null:contribution*p.oldAgeEurMillion/
      entry.categories.reduce((n,c)=>n+c.eurMillion,0),
    survivorsAllocated:contribution===null?null:contribution*p.survivorsEurMillion/
      entry.categories.reduce((n,c)=>n+c.eurMillion,0),
    totalAllocated:contribution===null?null:contribution*p.publicShare,
  };
}
