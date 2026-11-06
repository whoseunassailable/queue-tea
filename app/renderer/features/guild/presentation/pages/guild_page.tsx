import cup from '../../../../../../.claude-plugin/icon.png'
import type { EngineApi } from '../../../../../shared/engine_api'
import { Failed } from '../../../../core/widgets/states'
import { t } from '../../../../l10n/en'
import { HELPERS } from '../../domain/helpers'
import { useHelperJobs } from '../state_management/helper_jobs'
import { HelperCard } from '../widgets/helper_card'
import type { GuildRealm } from '../widgets/helper_card'

// The helpers, each ready for an order in the realm picked in the sidebar.
export const GuildPage = ({ engine, realm, onCopy }: { engine: EngineApi; realm: GuildRealm | null; onCopy: (text: string) => void }) => {
  const { read, jobOf, send, retry, stop } = useHelperJobs(engine)

  return (
    <main class="page">
      <section class="guild-h panel panel-pad" aria-labelledby="guild-h">
        <img src={cup} alt={t.guild.cup} width={84} height={84} />
        <div>
          <h1 id="guild-h">{t.guild.title}</h1>
          <p>{t.guild.line}</p>
          <p>{t.guild.where}</p>
          <p>{realm === null ? t.guild.pickRealm : t.guild.worksIn(realm.name)}</p>
        </div>
      </section>
      {read.load.status === 'failed' && <Failed message={read.load.message} onRetry={read.retry} />}
      <div class="party">
        {HELPERS.map(helper => (
          <HelperCard
            key={helper.id}
            helper={helper}
            job={jobOf(helper.id)}
            isChecking={read.load.status === 'loading'}
            realm={realm}
            onSend={(key, order) => send(key, helper.id, order)}
            onStop={() => stop(helper.id)}
            onRetry={retry}
            onCopy={onCopy}
          />
        ))}
      </div>
    </main>
  )
}
