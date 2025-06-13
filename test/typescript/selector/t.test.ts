import { describe, it, expectTypeOf } from 'vitest';
import { getFixedT, TFunction } from 'i18next';

declare const t: TFunction;

describe('t', () => {
  it('basic selector usage', () => {
    expectTypeOf(t(($) => $.beverage)).toEqualTypeOf<'beverage'>();

    expectTypeOf(t(($) => $['beverage|beer'])).toEqualTypeOf<'beer'>();

    expectTypeOf(t(($) => $.coffee.bar['espresso|americano'])).toEqualTypeOf<'a hot americano'>();

    expectTypeOf(t(($) => $.coffee.bar['espresso|cappuccino'])).toEqualTypeOf<
      'a dry cappuccino' | '{{count}} dry cappuccinos'
    >();

    expectTypeOf(
      t(($) => $.coffee.bar['espresso|cappuccino_one']),
    ).toEqualTypeOf<'a dry cappuccino'>();

    expectTypeOf(
      t(($) => $.coffee.bar['espresso|cappuccino_other']),
    ).toEqualTypeOf<'{{count}} dry cappuccinos'>();

    expectTypeOf(t(($) => $.coffee.bar['espresso|latte'])).toEqualTypeOf<
      'a foamy latte' | '{{count}} foamy lattes'
    >();

    expectTypeOf(t(($) => $.coffee.bar['espresso|latte_one'])).toEqualTypeOf<'a foamy latte'>();

    expectTypeOf(
      t(($) => $.coffee.bar['espresso|latte_other']),
    ).toEqualTypeOf<'{{count}} foamy lattes'>();

    expectTypeOf(t(($) => $.coffee.bar.shot)).toEqualTypeOf<'a shot of espresso'>();

    expectTypeOf(t(($) => $.coffee.drip.black)).toEqualTypeOf<'a strong cup of black coffee'>();

    expectTypeOf(t(($) => $['dessert|cake'])).toEqualTypeOf<'a nice cake'>();

    expectTypeOf(t(($) => $['dessert|muffin'])).toEqualTypeOf<
      'a nice muffin' | '{{count}} nice muffins'
    >();

    expectTypeOf(t(($) => $['dessert|muffin_one'])).toEqualTypeOf<'a nice muffin'>();

    expectTypeOf(t(($) => $['dessert|muffin_other'])).toEqualTypeOf<'{{count}} nice muffins'>();

    expectTypeOf(t(($) => $.sodas.coca_cola.coke)).toEqualTypeOf<'a can of coke'>();

    expectTypeOf(t(($) => $.sodas.coca_cola['coke|diet'])).toEqualTypeOf<
      'a can of diet coke' | '{{count}} cans of diet coke'
    >();

    expectTypeOf(
      t(($) => $.sodas.coca_cola['coke|diet_one']),
    ).toEqualTypeOf<'a can of diet coke'>();

    expectTypeOf(
      t(($) => $.sodas.coca_cola['coke|diet_other']),
    ).toEqualTypeOf<'{{count}} cans of diet coke'>();

    expectTypeOf(t(($) => $.sodas.faygo.orange)).toEqualTypeOf<
      'one orange faygo' | '{{count}} orange faygo'
    >();

    expectTypeOf(t(($) => $.sodas.faygo.orange_one)).toEqualTypeOf<'one orange faygo'>();

    expectTypeOf(t(($) => $.sodas.faygo.orange_other)).toEqualTypeOf<'{{count}} orange faygo'>();

    expectTypeOf(t(($) => $.sodas.faygo.purple)).toEqualTypeOf<'purple faygo'>();

    expectTypeOf(t(($) => $.tea)).toEqualTypeOf<
      'a cuppa tea and a lie down' | '{{count}} cups of tea and a big sleep'
    >();

    expectTypeOf(t(($) => $.tea_one)).toEqualTypeOf<'a cuppa tea and a lie down'>();

    expectTypeOf(t(($) => $.tea_other)).toEqualTypeOf<'{{count}} cups of tea and a big sleep'>();
  });

  it('selector works with arrays', () => {
    expectTypeOf(t(($) => $.array[0])).toEqualTypeOf<'element one'>();

    expectTypeOf(t(($) => $.array[1].elementTwo)).toEqualTypeOf<'element two'>();

    expectTypeOf(
      t(($) => $.array[2].elementThree[0].nestedElementThree),
    ).toEqualTypeOf<'element three'>();
  });

  it('selector works with context', () => {
    expectTypeOf(t(($) => $.dessert, { context: 'cake' })).toEqualTypeOf<'a nice cake'>();

    expectTypeOf(t(($) => $.dessert, { context: 'muffin' })).toEqualTypeOf<
      'a nice muffin' | '{{count}} nice muffins'
    >();

    expectTypeOf(t(($) => $.coffee.bar.espresso, { context: 'cappuccino' })).toEqualTypeOf<
      'a dry cappuccino' | '{{count}} dry cappuccinos'
    >();

    expectTypeOf(t(($) => $.coffee.bar.espresso, { context: 'latte' })).toEqualTypeOf<
      'a foamy latte' | '{{count}} foamy lattes'
    >();

    expectTypeOf(t(($) => $.sodas.coca_cola.coke, { context: 'diet' })).toEqualTypeOf<
      'a can of diet coke' | '{{count}} cans of diet coke'
    >();
  });

  it('getFixedT', () => {
    const fixedT = getFixedT(null, 'ns1', 'coffee');

    expectTypeOf(fixedT(($) => $.bar.shot)).toEqualTypeOf<'a shot of espresso'>();
  });

  it('namespace: single', () => {
    expectTypeOf(t(($) => $.fromNs2, { ns: 'ns2' })).toEqualTypeOf<'hello from ns2'>();
  });

  it('namespace: multiple', () => {
    expectTypeOf(t(($) => $.fromNs2, { ns: ['ns2', 'ns3'] })).toEqualTypeOf<'hello from ns2'>();
    expectTypeOf(t(($) => $.fromNs3, { ns: ['ns3', 'ns2'] })).toEqualTypeOf<'hello from ns3'>();
  });

  it('returnObjects', () => {
    expectTypeOf(t(($) => $.sodas.faygo, { returnObjects: true })).toEqualTypeOf<{
      orange: 'one orange faygo' | '{{count}} orange faygo';
      purple: 'purple faygo';
      orange_one: 'one orange faygo';
      orange_other: '{{count}} orange faygo';
    }>();

    expectTypeOf(t(($) => $.array[1], { returnObjects: true })).toEqualTypeOf<{
      elementTwo: 'element two';
    }>();
  });

  it('defaultValue', () => {
    expectTypeOf(t(($) => $.beverage, { defaultValue: 'defaultValue' })).toEqualTypeOf<
      'beverage' | 'defaultValue'
    >();
    expectTypeOf(t(($) => $['beverage|beer'], { defaultValue: 'defaultValue' })).toEqualTypeOf<
      'beer' | 'defaultValue'
    >();
    expectTypeOf(t(($) => $.array[0], { defaultValue: 'defaultValue' })).toEqualTypeOf<
      'element one' | 'defaultValue'
    >();
    expectTypeOf(t(($) => $.array[1].elementTwo, { defaultValue: 'hi' })).toEqualTypeOf<
      'element two' | 'hi'
    >();
  });

  it('returnObjects + defaultValue', () => {
    expectTypeOf(
      t(($) => $.array[1], { returnObjects: true, defaultValue: 'defaultValue' }),
    ).toEqualTypeOf<{ elementTwo: 'element two' } | 'defaultValue'>();
  });

  it('defaultValue + context', () => {
    expectTypeOf(
      t(($) => $.beverage, { context: 'beer', defaultValue: 'defaultValue' }),
    ).toEqualTypeOf<'beer' | 'defaultValue'>();
  });
});
