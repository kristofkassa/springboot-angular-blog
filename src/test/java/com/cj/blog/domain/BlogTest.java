package com.cj.blog.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.cj.blog.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

public class BlogTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Blog.class);
        Blog blog1 = new Blog();
        blog1.setId(1L);
        Blog blog2 = new Blog();
        blog2.setId(blog1.getId());
        assertThat(blog1).isEqualTo(blog2);
        blog2.setId(2L);
        assertThat(blog1).isNotEqualTo(blog2);
        blog1.setId(null);
        assertThat(blog1).isNotEqualTo(blog2);
    }
}
