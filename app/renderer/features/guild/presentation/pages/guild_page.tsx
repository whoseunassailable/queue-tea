import cup from '../../../../../../.claude-plugin/icon.png'
import { t } from '../../../../l10n/en'
import { HELPERS } from '../../domain/helpers'

const skillsText = (skills: string[]): string => (skills.length > 1 ? `${skills[0]} +${skills.length - 1}` : (skills[0] ?? ''))

// Read-only: it teaches the @-mentions that work today, and hands nothing out.
export const GuildPage = ({ onCopy }: { onCopy: (text: string) => void }) => (
  <main class="page">
    <section class="guild-h panel panel-pad" aria-labelledby="guild-h">
      <img src={cup} alt={t.guild.cup} width={84} height={84} />
      <div>
        <h1 id="guild-h">{t.guild.title}</h1>
        <p>{t.guild.line}</p>
      </div>
    </section>
    <div class="party">
      {HELPERS.map(helper => (
        <article key={helper.id} class={`member panel ${helper.kind}`}>
          <div class="m-top">
            <span class="portrait">
              <img src={helper.logo} alt="" width={70} height={70} />
            </span>
            <div>
              <h2 class="m-name">{helper.name}</h2>
              <span class="m-class">{helper.role}</span>
            </div>
          </div>
          <p class="m-desc">{helper.summary}</p>
          <p class="card-note">
            <b>{t.guild.skills}</b> · {skillsText(helper.skills)}
          </p>
          <div class="m-call">
            <code>{helper.mention}</code>
            <button type="button" class="icon-btn" aria-label={t.guild.copy(helper.name)} onClick={() => onCopy(helper.mention)}>
              ⧉
            </button>
          </div>
        </article>
      ))}
    </div>
  </main>
)
