package com.cj.blog.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cj.blog.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class TagTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tag.class);
        Tag tag1 = new Tag();
        tag1.setId(1L);
        Tag tag2 = new Tag();
        tag2.setId(tag1.getId());
        assertThat(tag1).isEqualTo(tag2);
        tag2.setId(2L);
        assertThat(tag1).isNotEqualTo(tag2);
        tag1.setId(null);
        assertThat(tag1).isNotEqualTo(tag2);
    }
}
