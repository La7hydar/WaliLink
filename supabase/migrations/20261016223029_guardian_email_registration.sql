ALTER TABLE public.guardians
  ADD COLUMN email text;

CREATE UNIQUE INDEX guardians_email_lower_key
  ON public.guardians (lower(email))
  WHERE email IS NOT NULL;

DROP POLICY IF EXISTS guardian_registration_link_verified_phone ON public.guardians;
DROP POLICY IF EXISTS guardian_registration_read_by_verified_phone ON public.guardians;
DROP POLICY IF EXISTS guardian_registration_read_children_by_verified_phone ON public.students;

REVOKE UPDATE ON TABLE public.guardians FROM anon, authenticated;
GRANT UPDATE (auth_user_id) ON TABLE public.guardians TO authenticated;

CREATE POLICY guardian_registration_read_by_verified_email ON public.guardians
  FOR SELECT TO authenticated
  USING (
    auth_user_id = (SELECT auth.uid())
    OR (
      auth_user_id IS NULL
      AND email IS NOT NULL
      AND lower(email) = lower((SELECT auth.jwt() ->> 'email'))
    )
  );

CREATE POLICY guardian_registration_read_children_by_verified_email ON public.students
  FOR SELECT TO authenticated
  USING (
    guardian_id IN (
      SELECT g.id
      FROM public.guardians AS g
      WHERE g.auth_user_id = (SELECT auth.uid())
         OR (
           g.auth_user_id IS NULL
           AND g.email IS NOT NULL
           AND lower(g.email) = lower((SELECT auth.jwt() ->> 'email'))
         )
    )
  );

CREATE POLICY guardian_registration_link_verified_email ON public.guardians
  FOR UPDATE TO authenticated
  USING (
    auth_user_id IS NULL
    AND email IS NOT NULL
    AND lower(email) = lower((SELECT auth.jwt() ->> 'email'))
  )
  WITH CHECK (
    auth_user_id = (SELECT auth.uid())
    AND email IS NOT NULL
    AND lower(email) = lower((SELECT auth.jwt() ->> 'email'))
  );