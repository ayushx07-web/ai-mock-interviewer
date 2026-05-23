// src/pages/interview/SetupPage.jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Play, ChevronRight, Briefcase, Building2, BarChart2, Users } from 'lucide-react';
import { useCreateSessionMutation } from '../../store/api/sessionApi';
import { useSession } from '../../hooks/useSession';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ROLES, COMPANIES, DIFFICULTIES } from '../../utils/constants';

const setupSchema = z.object({
  targetRole: z.string().min(1, 'Please select a target role'),
  companyType: z.string().min(1, 'Please select a company type'),
  difficulty: z.string().min(1, 'Please select a difficulty'),
});

function SectionLabel({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <p className="text-sm font-medium text-foreground">{label}</p>
    </div>
  );
}

export default function SetupPage() {
  const navigate = useNavigate();
  const { startSession } = useSession();
  const [createSession, { isLoading }] = useCreateSessionMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(setupSchema),
    defaultValues: { targetRole: '', companyType: '', difficulty: 'MEDIUM' },
  });

  const selectedDifficulty = watch('difficulty');
  const selectedCompany = watch('companyType');

  const onSubmit = async (data) => {
    try {
      const result = await createSession(data).unwrap();
      const session = result.data;
      startSession(session.id, session.questions);
      navigate(`/interview/${session.id}`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create session. Please try again.');
    }
  };

  return (
    <div className="px-8 py-8 max-w-lg">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">New Interview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your session and the AI will generate tailored questions for you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-7">
        {/* Target Role */}
        <div>
          <SectionLabel icon={Briefcase} label="Target Role" />
          <select
            id="targetRole"
            className="input-base"
            {...register('targetRole')}
          >
            <option value="">Select a role…</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.targetRole && (
            <p className="text-xs text-destructive mt-1.5">{errors.targetRole.message}</p>
          )}
        </div>

        {/* Company Type */}
        <div>
          <SectionLabel icon={Building2} label="Company Type" />
          <div className="flex flex-wrap gap-2">
            {COMPANIES.map((company) => (
              <button
                key={company}
                type="button"
                onClick={() => setValue('companyType', company, { shouldValidate: true })}
                className={`px-4 py-2 rounded text-sm font-medium border transition-colors ${
                  selectedCompany === company
                    ? 'bg-primary/15 border-primary/40 text-primary'
                    : 'bg-surface-2 border-border text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                {company}
              </button>
            ))}
          </div>
          {errors.companyType && (
            <p className="text-xs text-destructive mt-1.5">{errors.companyType.message}</p>
          )}
        </div>

        {/* Difficulty */}
        <div>
          <SectionLabel icon={BarChart2} label="Difficulty" />
          <div className="flex gap-2">
            {DIFFICULTIES.map(({ value, label }) => {
              const colorMap = { EASY: 'success', MEDIUM: 'warning', HARD: 'destructive' };
              const color = colorMap[value];
              const isSelected = selectedDifficulty === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('difficulty', value, { shouldValidate: true })}
                  className={`flex-1 py-2.5 rounded text-sm font-medium border transition-colors ${
                    isSelected
                      ? `bg-${color}/10 border-${color}/30 text-${color}`
                      : 'bg-surface-2 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary self-start px-6 py-2.5"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              Generating questions…
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start interview
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
