import React, { useRef, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Screen from '../../components/Screen';
import SectionHeader from '../../components/SectionHeader';
import GlassCard from '../../components/GlassCard';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import SocialLinks from '../../components/SocialLinks';
import Reveal from '../../components/Reveal';
import Icon from '../../components/Icon';
import { colors, type } from '../../constants/theme';
import { useContent } from '../../context/ContentContext';
import { useBreakpoint } from '../../lib/responsive';
import { LIMITS, validateContact } from '../../lib/validate';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

const EMPTY = { name: '', email: '', subject: '', message: '' };
const COOLDOWN_MS = 20000;

export default function ContactScreen() {
  const params = useLocalSearchParams();
  const presetSubject = Array.isArray(params.subject) ? params.subject[0] : params.subject;
  const { settings } = useContent();
  const { isWide } = useBreakpoint();

  const [values, setValues] = useState({ ...EMPTY, subject: presetSubject || '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [notice, setNotice] = useState('');
  const lastSent = useRef(0);

  // Pre-fill the subject when arriving from the Services screen.
  const lastPreset = useRef(presetSubject);
  if (presetSubject && presetSubject !== lastPreset.current) {
    lastPreset.current = presetSubject;
    setValues((v) => ({ ...v, subject: presetSubject }));
  }

  const set = (key) => (text) => {
    setValues((v) => ({ ...v, [key]: text }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const submit = async () => {
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    if (Date.now() - lastSent.current < COOLDOWN_MS) {
      setStatus('error');
      setNotice('Please wait a few seconds before sending another message.');
      return;
    }

    setStatus('sending');
    setNotice('');
    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    };

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from('contact_submissions').insert(payload);
        if (error) throw error;
        lastSent.current = Date.now();
        setStatus('sent');
        setValues({ ...EMPTY });
      } else {
        // No database yet: open the visitor's email app with the message filled in.
        const to = settings.social_email || '';
        const body = `${payload.message}\n\n${payload.name}\n${payload.email}`;
        const url = `mailto:${to}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
        await Linking.openURL(url);
        lastSent.current = Date.now();
        setStatus('sent');
        setNotice('Your email app should open with the message ready to send. (Supabase is not set up yet, so nothing was stored.)');
      }
    } catch (err) {
      setStatus('error');
      setNotice('Sorry, the message could not be sent. Please try again or use one of the links on this page.');
    }
  };

  const form =
    status === 'sent' ? (
      <GlassCard glow innerStyle={styles.sent}>
        <View style={styles.sentIcon}>
          <Icon name="checkmark" size={30} color={colors.onAccent} />
        </View>
        <Text style={type.h2}>Message sent</Text>
        <Text style={[type.body, { textAlign: 'center' }]}>
          {notice || 'Thank you. I will get back to you as soon as I can.'}
        </Text>
        <Button title="Send another" variant="ghost" onPress={() => { setStatus('idle'); setNotice(''); }} />
      </GlassCard>
    ) : (
      <GlassCard>
        <FormField
          label="Name"
          value={values.name}
          onChangeText={set('name')}
          error={errors.name}
          placeholder="Your name"
          autoComplete="name"
          maxLength={LIMITS.name.max}
        />
        <FormField
          label="Email"
          value={values.email}
          onChangeText={set('email')}
          error={errors.email}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          maxLength={LIMITS.email.max}
        />
        <FormField
          label="Subject"
          value={values.subject}
          onChangeText={set('subject')}
          error={errors.subject}
          placeholder="What is this about?"
          maxLength={LIMITS.subject.max}
        />
        <FormField
          label="Message"
          value={values.message}
          onChangeText={set('message')}
          error={errors.message}
          placeholder="Tell me about your project..."
          multiline
          maxLength={LIMITS.message.max}
          hint={`${values.message.length} / ${LIMITS.message.max}`}
        />
        {status === 'error' && notice ? (
          <View style={styles.errorBox}>
            <Icon name="alert-circle" size={18} color={colors.danger} />
            <Text style={styles.errorText}>{notice}</Text>
          </View>
        ) : null}
        <Button
          title={status === 'sending' ? 'Sending...' : 'Send message'}
          icon="send"
          loading={status === 'sending'}
          onPress={submit}
        />
      </GlassCard>
    );

  return (
    <Screen>
      <Reveal>
        <SectionHeader eyebrow="Get in touch" title="Contact" subtitle={settings.contact_blurb} />
      </Reveal>

      <View style={[styles.cols, isWide && styles.colsWide]}>
        <Reveal delay={100} style={isWide ? { flex: 3 } : undefined}>
          {form}
        </Reveal>
        <Reveal delay={180} style={isWide ? { flex: 2 } : undefined}>
          <GlassCard innerStyle={{ gap: 14 }}>
            <Text style={type.eyebrow}>Find me online</Text>
            <SocialLinks />
          </GlassCard>
        </Reveal>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cols: { gap: 20 },
  colsWide: { flexDirection: 'row', alignItems: 'flex-start', gap: 24 },
  sent: { alignItems: 'center', gap: 14, paddingVertical: 26 },
  sentIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cyan,
  },
  errorBox: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(251,113,133,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251,113,133,0.35)',
    marginBottom: 16,
  },
  errorText: { color: colors.danger, fontSize: 13.5, flex: 1, lineHeight: 19 },
});
